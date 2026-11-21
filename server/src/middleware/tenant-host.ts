import type { RequestHandler } from "express"
import { eq, sql } from "drizzle-orm"

import { env } from "../config"
import { getDb } from "../db"
import { schools, tenants } from "../db/schema"
import { ApiError } from "../features/platform/errors"
import { parseTenantHost, schoolCodeMatches, type TenantApp } from "../tenant/host"

export type ResolvedSchool = {
  id: string
  tenantId: string
  tenantKey: string
  tenantStatus: "active" | "archived"
  schoolCode: string
  name: string
  status: "active" | "suspended" | "archived"
  email: string
  phone: string
  website: string | null
  description: string | null
  logoStorageKey: string | null
  bannerStorageKey: string | null
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  schoolType: string
  board: string | null
  timezone: string
  defaultLanguage: string
}

export function hostFromRequest(req: { header(name: string): string | undefined }): string {
  const forwarded = req.header("x-mmk-school-host")
  if (forwarded && forwarded.trim().length > 0) {
    return forwarded.trim()
  }
  return req.header("host") ?? ""
}

export async function resolveSchoolFromHost(rawHost: string, app: TenantApp): Promise<ResolvedSchool | null> {
  const parsed = parseTenantHost(rawHost, {
    schoolAdminLocalBaseDomain: env.SCHOOL_ADMIN_LOCAL_BASE_DOMAIN,
    schoolPortalLocalBaseDomain: env.SCHOOL_PORTAL_LOCAL_BASE_DOMAIN,
    schoolAdminProductionBaseDomain: env.SCHOOL_ADMIN_PRODUCTION_BASE_DOMAIN,
    schoolPortalProductionBaseDomain: env.SCHOOL_PORTAL_PRODUCTION_BASE_DOMAIN,
    schoolAdminLocalPort: env.SCHOOL_ADMIN_LOCAL_PORT,
    portalLocalPort: env.SCHOOL_PORTAL_LOCAL_PORT,
  })
  if (!parsed.ok || parsed.app !== app) {
    return null
  }
  const [row] = await getDb()
    .select({
      school: schools,
      tenantKey: tenants.tenantKey,
      tenantStatus: tenants.status,
    })
    .from(schools)
    .innerJoin(tenants, eq(tenants.id, schools.tenantId))
    .where(sql`lower(${schools.schoolCode}) = ${parsed.label}`)
    .limit(1)
  if (!row || !schoolCodeMatches(row.school.schoolCode, parsed.label)) {
    return null
  }
  return {
    id: row.school.id,
    tenantId: row.school.tenantId,
    tenantKey: row.tenantKey,
    tenantStatus: row.tenantStatus,
    schoolCode: row.school.schoolCode,
    name: row.school.name,
    status: row.school.status,
    email: row.school.email,
    phone: row.school.phone,
    website: row.school.website,
    description: row.school.description,
    logoStorageKey: row.school.logoStorageKey,
    bannerStorageKey: row.school.bannerStorageKey,
    addressLine1: row.school.addressLine1,
    addressLine2: row.school.addressLine2,
    city: row.school.city,
    state: row.school.state,
    postalCode: row.school.postalCode,
    country: row.school.country,
    schoolType: row.school.schoolType,
    board: row.school.board,
    timezone: row.school.timezone,
    defaultLanguage: row.school.defaultLanguage,
  }
}

export function requireSchoolHost(app: TenantApp = "school-admin"): RequestHandler {
  return async (req, _res, next) => {
    try {
      const parsed = parseTenantHost(hostFromRequest(req), {
        schoolAdminLocalBaseDomain: env.SCHOOL_ADMIN_LOCAL_BASE_DOMAIN,
        schoolPortalLocalBaseDomain: env.SCHOOL_PORTAL_LOCAL_BASE_DOMAIN,
        schoolAdminProductionBaseDomain: env.SCHOOL_ADMIN_PRODUCTION_BASE_DOMAIN,
        schoolPortalProductionBaseDomain: env.SCHOOL_PORTAL_PRODUCTION_BASE_DOMAIN,
        schoolAdminLocalPort: env.SCHOOL_ADMIN_LOCAL_PORT,
        portalLocalPort: env.SCHOOL_PORTAL_LOCAL_PORT,
      })
      if (!parsed.ok || parsed.app !== app) {
        throw new ApiError(404, "NOT_FOUND", "Not found.")
      }
      const school = await resolveSchoolFromHost(hostFromRequest(req), app)
      if (!school) {
        throw new ApiError(404, "NOT_FOUND", "Not found.")
      }
      req.tenantApp = app
      req.school = school
      next()
    } catch (error) {
      next(error)
    }
  }
}

export function requireSchoolAvailable(): RequestHandler {
  return (req, _res, next) => {
    const school = req.school
    if (!school || school.status !== "active" || school.tenantStatus !== "active") {
      next(new ApiError(403, "SCHOOL_UNAVAILABLE", "This school account is not available."))
      return
    }
    next()
  }
}
