import { createHash } from "node:crypto"

import { and, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm"

import { getDb } from "../../../db"
import {
  platformAdminAuditLogs,
  platformIdempotencyKeys,
  schoolAdminAccounts,
  schoolCommercialTerms,
  schools,
  tenants,
} from "../../../db/schema"
import { insertAudit } from "../audit/audit.repository"
import { ApiError } from "../errors"
import type { SchoolBody, SchoolUpdate } from "./schools.schemas"

type Meta = {
  ipAddress: string | null
  userAgent: string | null
  correlationId: string | null
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function commercialState(start: string, end: string): "scheduled" | "active" | "ended" {
  const today = todayIso()
  if (today < start) {
    return "scheduled"
  }
  if (today > end) {
    return "ended"
  }
  return "active"
}

function blankToNull(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? ""
  return trimmed.length > 0 ? trimmed : null
}

function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false
  }
  const record = error as { code?: unknown; message?: unknown; cause?: unknown }
  if (record.code === "23505") {
    return true
  }
  if (typeof record.message === "string" && record.message.toLowerCase().includes("duplicate key")) {
    return true
  }
  return isUniqueViolation(record.cause)
}

function requestHash(body: unknown): string {
  return createHash("sha256").update(JSON.stringify(body)).digest("hex")
}

async function loadSchool(id: string) {
  const db = getDb()
  const [row] = await db
    .select({
      school: schools,
      commercial: schoolCommercialTerms,
      admin: schoolAdminAccounts,
      tenantKey: tenants.tenantKey,
    })
    .from(schools)
    .innerJoin(tenants, eq(tenants.id, schools.tenantId))
    .innerJoin(
      schoolCommercialTerms,
      eq(schoolCommercialTerms.schoolId, schools.id),
    )
    .innerJoin(schoolAdminAccounts, eq(schoolAdminAccounts.schoolId, schools.id))
    .where(eq(schools.id, id))
    .limit(1)
  if (!row) {
    throw new ApiError(404, "NOT_FOUND", "The school was not found.")
  }
  const activity = await db
    .select({
      id: platformAdminAuditLogs.id,
      action: platformAdminAuditLogs.action,
      reason: platformAdminAuditLogs.reason,
      createdAt: platformAdminAuditLogs.createdAt,
    })
    .from(platformAdminAuditLogs)
    .where(eq(platformAdminAuditLogs.entityId, row.school.id))
    .orderBy(desc(platformAdminAuditLogs.createdAt))
    .limit(20)
  return {
    id: row.school.id,
    tenantId: row.school.tenantId,
    tenantKey: row.tenantKey,
    name: row.school.name,
    schoolCode: row.school.schoolCode,
    website: row.school.website,
    email: row.school.email,
    phone: row.school.phone,
    schoolType: row.school.schoolType,
    board: row.school.board,
    country: row.school.country,
    state: row.school.state,
    city: row.school.city,
    postalCode: row.school.postalCode,
    addressLine1: row.school.addressLine1,
    addressLine2: row.school.addressLine2,
    timezone: row.school.timezone,
    defaultLanguage: row.school.defaultLanguage,
    status: row.school.status,
    provisioningStatus: row.school.provisioningStatus,
    archivedAt: row.school.archivedAt,
    archiveReason: row.school.archiveReason,
    createdAt: row.school.createdAt,
    updatedAt: row.school.updatedAt,
    commercial: {
      billingModel: row.commercial.billingModel,
      perStudentRate: row.commercial.perStudentRate,
      currency: row.commercial.currency,
      billingFrequency: row.commercial.billingFrequency,
      subscriptionStart: row.commercial.subscriptionStart,
      subscriptionEnd: row.commercial.subscriptionEnd,
      studentLimit: row.commercial.studentLimit,
      notes: row.commercial.notes,
      status: row.commercial.status,
    },
    initialAdmin: {
      id: row.admin.id,
      fullName: row.admin.fullName,
      email: row.admin.email,
      phone: row.admin.phone,
      status: row.admin.status,
      invitationDelivery: row.admin.invitationDelivery,
    },
    usage: {
      students: null,
      teachers: null,
      available: false,
    },
    activity,
  }
}

export async function createSchool(
  actorId: string,
  body: SchoolBody,
  meta: Meta,
  options?: { failForTest?: boolean; idempotencyKey?: string },
) {
  const hash = requestHash(body)
  const db = getDb()
  if (options?.idempotencyKey) {
    const [existing] = await db
      .select()
      .from(platformIdempotencyKeys)
      .where(
        and(
          eq(platformIdempotencyKeys.adminUserId, actorId),
          eq(platformIdempotencyKeys.idempotencyKey, options.idempotencyKey),
        ),
      )
      .limit(1)
    if (existing) {
      if (existing.requestHash !== hash) {
        throw new ApiError(
          409,
          "IDEMPOTENCY_CONFLICT",
          "This idempotency key was already used for a different request.",
        )
      }
      return loadSchool(existing.schoolId)
    }
  }

  try {
    const schoolId = await db.transaction(async (tx) => {
      const [tenant] = await tx
        .insert(tenants)
        .values({ tenantKey: body.schoolCode, status: "active" })
        .returning()
      if (!tenant) {
        throw new ApiError(500, "INTERNAL_ERROR", "The request could not be completed.")
      }
      if (options?.failForTest) {
        throw new ApiError(500, "PROVISIONING_FAILED", "School provisioning failed.")
      }
      const [school] = await tx
        .insert(schools)
        .values({
          tenantId: tenant.id,
          schoolCode: body.schoolCode,
          name: body.name,
          website: blankToNull(body.website),
          email: body.email,
          phone: body.phone,
          schoolType: body.schoolType,
          board: blankToNull(body.board),
          country: body.country,
          state: body.state,
          city: body.city,
          postalCode: body.postalCode,
          addressLine1: body.addressLine1,
          addressLine2: blankToNull(body.addressLine2),
          status: "active",
          provisioningStatus: "ready",
          createdBy: actorId,
          updatedBy: actorId,
        })
        .returning()
      if (!school) {
        throw new ApiError(500, "INTERNAL_ERROR", "The request could not be completed.")
      }
      await tx.insert(schoolCommercialTerms).values({
        schoolId: school.id,
        billingModel: body.billingModel,
        perStudentRate: body.perStudentRate,
        billingFrequency: body.billingFrequency,
        subscriptionStart: body.subscriptionStart,
        subscriptionEnd: body.subscriptionEnd,
        studentLimit: body.studentLimit ?? null,
        notes: blankToNull(body.commercialNotes),
        status: commercialState(body.subscriptionStart, body.subscriptionEnd),
      })
      await tx.insert(schoolAdminAccounts).values({
        schoolId: school.id,
        fullName: body.adminName,
        email: body.adminEmail,
        phone: body.adminPhone,
      })
      if (options?.idempotencyKey) {
        await tx.insert(platformIdempotencyKeys).values({
          adminUserId: actorId,
          idempotencyKey: options.idempotencyKey,
          requestHash: hash,
          schoolId: school.id,
        })
      }
      await insertAudit(tx, {
        actorAdminId: actorId,
        action: "school.created",
        entityType: "school",
        entityId: school.id,
        afterData: { schoolCode: body.schoolCode, name: body.name },
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        correlationId: meta.correlationId,
      })
      return school.id
    })
    return loadSchool(schoolId)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    if (isUniqueViolation(error)) {
      throw new ApiError(409, "SCHOOL_CODE_TAKEN", "That school code is already in use.")
    }
    throw error
  }
}

export async function listSchools(query: {
  q?: string
  status?: "active" | "suspended" | "archived"
  subscriptionStatus?: "scheduled" | "active" | "ended"
  createdFrom?: string
  createdTo?: string
  page: number
  pageSize: number
}) {
  const filters = []
  if (query.q) {
    const pattern = `%${query.q}%`
    filters.push(
      or(
        ilike(schools.name, pattern),
        ilike(schools.schoolCode, pattern),
        ilike(schools.email, pattern),
      ),
    )
  }
  if (query.status) {
    filters.push(eq(schools.status, query.status))
  }
  if (query.subscriptionStatus) {
    filters.push(eq(schoolCommercialTerms.status, query.subscriptionStatus))
  }
  if (query.createdFrom) {
    filters.push(gte(schools.createdAt, new Date(`${query.createdFrom}T00:00:00.000Z`)))
  }
  if (query.createdTo) {
    filters.push(lte(schools.createdAt, new Date(`${query.createdTo}T23:59:59.999Z`)))
  }
  const where = filters.length > 0 ? and(...filters) : undefined
  const db = getDb()
  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schools)
    .innerJoin(
      schoolCommercialTerms,
      eq(schoolCommercialTerms.schoolId, schools.id),
    )
    .where(where)
  const rows = await db
    .select({
      id: schools.id,
      name: schools.name,
      schoolCode: schools.schoolCode,
      email: schools.email,
      phone: schools.phone,
      status: schools.status,
      createdAt: schools.createdAt,
      subscriptionStatus: schoolCommercialTerms.status,
    })
    .from(schools)
    .innerJoin(
      schoolCommercialTerms,
      eq(schoolCommercialTerms.schoolId, schools.id),
    )
    .where(where)
    .orderBy(desc(schools.createdAt))
    .limit(query.pageSize)
    .offset((query.page - 1) * query.pageSize)

  return {
    data: rows.map((row) => ({
      ...row,
      studentCount: null,
    })),
    page: {
      page: query.page,
      pageSize: query.pageSize,
      total: countRow?.count ?? 0,
    },
  }
}

export async function getSchool(id: string) {
  return loadSchool(id)
}

export async function updateSchool(
  actorId: string,
  id: string,
  body: SchoolUpdate,
  meta: Meta,
) {
  const current = await loadSchool(id)
  if (current.status === "archived") {
    throw new ApiError(409, "SCHOOL_ARCHIVED", "Archived schools cannot be edited.")
  }
  const db = getDb()
  await db.transaction(async (tx) => {
    await tx
      .update(schools)
      .set({
        name: body.name,
        website: blankToNull(body.website),
        email: body.email,
        phone: body.phone,
        schoolType: body.schoolType,
        board: blankToNull(body.board),
        country: body.country,
        state: body.state,
        city: body.city,
        postalCode: body.postalCode,
        addressLine1: body.addressLine1,
        addressLine2: blankToNull(body.addressLine2),
        updatedAt: new Date(),
        updatedBy: actorId,
      })
      .where(eq(schools.id, id))
    await tx
      .update(schoolCommercialTerms)
      .set({
        billingModel: body.billingModel,
        perStudentRate: body.perStudentRate,
        billingFrequency: body.billingFrequency,
        subscriptionStart: body.subscriptionStart,
        subscriptionEnd: body.subscriptionEnd,
        studentLimit: body.studentLimit ?? null,
        notes: blankToNull(body.commercialNotes),
        status: commercialState(body.subscriptionStart, body.subscriptionEnd),
        updatedAt: new Date(),
      })
      .where(eq(schoolCommercialTerms.schoolId, id))
    await tx
      .update(schoolAdminAccounts)
      .set({
        fullName: body.adminName,
        email: body.adminEmail,
        phone: body.adminPhone,
      })
      .where(eq(schoolAdminAccounts.schoolId, id))
    await insertAudit(tx, {
      actorAdminId: actorId,
      action: "school.updated",
      entityType: "school",
      entityId: id,
      beforeData: current,
      afterData: body,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      correlationId: meta.correlationId,
    })
  })
  return loadSchool(id)
}

async function transition(
  actorId: string,
  id: string,
  action: "suspend" | "activate" | "archive",
  reason: string | undefined,
  meta: Meta,
) {
  const current = await loadSchool(id)
  if (action === "suspend" && current.status !== "active") {
    throw new ApiError(409, "INVALID_STATE", "Only an active school can be suspended.")
  }
  if (action === "activate" && current.status !== "suspended") {
    throw new ApiError(409, "INVALID_STATE", "Only a suspended school can be activated.")
  }
  if (action === "archive" && current.status === "archived") {
    throw new ApiError(409, "INVALID_STATE", "The school is already archived.")
  }
  const nextStatus = action === "suspend" ? "suspended" : action === "activate" ? "active" : "archived"
  await getDb().transaction(async (tx) => {
    await tx
      .update(schools)
      .set({
        status: nextStatus,
        archivedAt: action === "archive" ? new Date() : current.archivedAt,
        archiveReason: action === "archive" ? (reason ?? null) : current.archiveReason,
        updatedAt: new Date(),
        updatedBy: actorId,
      })
      .where(eq(schools.id, id))
    if (action === "archive") {
      await tx
        .update(tenants)
        .set({ status: "archived" })
        .where(eq(tenants.id, current.tenantId))
    }
    await insertAudit(tx, {
      actorAdminId: actorId,
      action: `school.${action}`,
      entityType: "school",
      entityId: id,
      beforeData: { status: current.status },
      afterData: { status: nextStatus },
      reason: reason ?? null,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      correlationId: meta.correlationId,
    })
  })
  return loadSchool(id)
}

export const suspendSchool = (
  actorId: string,
  id: string,
  reason: string | undefined,
  meta: Meta,
) => transition(actorId, id, "suspend", reason, meta)

export const activateSchool = (
  actorId: string,
  id: string,
  reason: string | undefined,
  meta: Meta,
) => transition(actorId, id, "activate", reason, meta)

export const archiveSchool = (
  actorId: string,
  id: string,
  reason: string | undefined,
  meta: Meta,
) => transition(actorId, id, "archive", reason, meta)
