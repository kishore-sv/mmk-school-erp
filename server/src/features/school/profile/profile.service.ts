import { eq } from "drizzle-orm"

import { env } from "../../../config"
import { getDb } from "../../../db"
import { schools } from "../../../db/schema"
import type { ResolvedSchool } from "../../../middleware/tenant-host"
import { createStorageProvider } from "../../../storage"
import { ApiError } from "../../platform/errors"
import { insertSchoolAudit } from "../audit"
import type { SchoolProfileUpdate } from "./profile.schemas"

function blankToNull(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? ""
  return trimmed.length > 0 ? trimmed : null
}

async function assetUrl(key: string | null): Promise<string | null> {
  if (!key) {
    return null
  }
  const storage = createStorageProvider(env)
  const signed = await storage.createPresignedDownloadUrl({ bucket: "", key })
  return signed.url
}

export async function getSchoolProfile(school: ResolvedSchool) {
  const [row] = await getDb().select().from(schools).where(eq(schools.id, school.id)).limit(1)
  if (!row) {
    throw new ApiError(404, "NOT_FOUND", "Not found.")
  }
  return {
    id: row.id,
    schoolCode: row.schoolCode,
    name: row.name,
    email: row.email,
    phone: row.phone,
    website: row.website,
    description: row.description,
    addressLine1: row.addressLine1,
    addressLine2: row.addressLine2,
    city: row.city,
    state: row.state,
    postalCode: row.postalCode,
    country: row.country,
    schoolType: row.schoolType,
    board: row.board,
    timezone: row.timezone,
    defaultLanguage: row.defaultLanguage,
    status: row.status,
    logoUrl: await assetUrl(row.logoStorageKey),
    bannerUrl: await assetUrl(row.bannerStorageKey),
    readOnly: ["schoolCode", "country", "schoolType", "board", "timezone", "defaultLanguage", "status"],
  }
}

export async function updateSchoolProfile(
  school: ResolvedSchool,
  actorId: string,
  body: SchoolProfileUpdate,
  meta: { ipAddress: string | null; userAgent: string | null; correlationId: string | null },
) {
  const before = await getSchoolProfile(school)
  await getDb()
    .update(schools)
    .set({
      name: body.name,
      website: blankToNull(body.website),
      email: body.email,
      phone: body.phone,
      addressLine1: body.addressLine1,
      addressLine2: blankToNull(body.addressLine2),
      city: body.city,
      state: body.state,
      postalCode: body.postalCode,
      description: blankToNull(body.description),
      updatedAt: new Date(),
    })
    .where(eq(schools.id, school.id))
  const after = await getSchoolProfile({ ...school, name: body.name })
  await insertSchoolAudit(getDb(), {
    schoolId: school.id,
    actorAdminId: actorId,
    action: "school.profile_updated",
    entityType: "school",
    entityId: school.id,
    beforeData: {
      name: before.name,
      email: before.email,
      phone: before.phone,
      website: before.website,
      description: before.description,
      addressLine1: before.addressLine1,
      city: before.city,
      state: before.state,
      postalCode: before.postalCode,
    },
    afterData: body,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    correlationId: meta.correlationId,
  })
  return after
}
