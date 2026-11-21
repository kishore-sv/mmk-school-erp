import { randomUUID } from "node:crypto"

import { and, eq, lt } from "drizzle-orm"
import { z } from "zod"

import { env } from "../../../config"
import { getDb } from "../../../db"
import { schools, storageUploads } from "../../../db/schema"
import { createStorageProvider } from "../../../storage"
import { ApiError } from "../../platform/errors"
import { insertAudit } from "../../platform/audit/audit.repository"
import { insertSchoolAudit } from "../audit"

const MIME = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
} as const

const LIMITS = {
  logo: 2_000_000,
  banner: 8_000_000,
} as const

const MULTIPART_THRESHOLD = 5_000_000

export const uploadIntentSchema = z.object({
  purpose: z.enum(["logo", "banner"]),
  contentType: z.enum(["image/png", "image/jpeg", "image/webp"]),
  contentLength: z.number().int().positive(),
})

function magicOk(contentType: string, bytes: Uint8Array): boolean {
  if (contentType === "image/png") {
    return bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
  }
  if (contentType === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  }
  if (contentType === "image/webp") {
    const text = new TextDecoder().decode(bytes.subarray(0, 12))
    return text.startsWith("RIFF") && text.includes("WEBP")
  }
  return false
}

type Actor = { kind: "platform_admin" | "school_admin"; id: string }

async function loadSchool(schoolId: string) {
  const [school] = await getDb().select().from(schools).where(eq(schools.id, schoolId)).limit(1)
  if (!school) {
    throw new ApiError(404, "NOT_FOUND", "The school was not found.")
  }
  return school
}

function assertSize(purpose: "logo" | "banner", contentLength: number) {
  if (contentLength > LIMITS[purpose]) {
    throw new ApiError(400, "FILE_TOO_LARGE", "The file is larger than the allowed size.")
  }
}

export async function initiateBrandingUpload(
  schoolId: string,
  actor: Actor,
  input: z.infer<typeof uploadIntentSchema>,
) {
  assertSize(input.purpose, input.contentLength)
  const school = await loadSchool(schoolId)
  const id = randomUUID()
  const ext = MIME[input.contentType]
  const objectKey = `tenants/${school.tenantId}/schools/${school.id}/branding/${input.purpose}/${id}.${ext}`
  const storage = createStorageProvider(env)
  const multipart = input.contentLength >= MULTIPART_THRESHOLD
  const upload = multipart
    ? await storage.createMultipartUpload({ bucket: env.STORAGE_BUCKET, key: objectKey }, {
        contentType: input.contentType,
        contentLength: input.contentLength,
      })
    : null
  const presigned = multipart
    ? null
    : await storage.createPresignedUploadUrl(
        { bucket: env.STORAGE_BUCKET, key: objectKey },
        { contentType: input.contentType, contentLength: input.contentLength },
      )
  await getDb().insert(storageUploads).values({
    id,
    schoolId: school.id,
    tenantId: school.tenantId,
    purpose: input.purpose,
    objectKey,
    contentType: input.contentType,
    contentLength: input.contentLength,
    status: "pending",
    multipartUploadId: upload?.uploadId ?? null,
    actorKind: actor.kind,
    actorId: actor.id,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  })
  return {
    uploadId: id,
    multipart: Boolean(upload),
    objectKey,
    presigned,
    partSize: multipart ? 5_000_000 : null,
  }
}

async function ownedUpload(schoolId: string, uploadId: string) {
  const [row] = await getDb()
    .select()
    .from(storageUploads)
    .where(and(eq(storageUploads.id, uploadId), eq(storageUploads.schoolId, schoolId)))
    .limit(1)
  if (!row) {
    throw new ApiError(404, "NOT_FOUND", "The upload was not found.")
  }
  if (row.expiresAt.getTime() <= Date.now() && row.status === "pending") {
    throw new ApiError(400, "UPLOAD_EXPIRED", "The upload URL has expired.")
  }
  if (!row.objectKey.startsWith(`tenants/${row.tenantId}/schools/${row.schoolId}/`)) {
    throw new ApiError(403, "FORBIDDEN", "The upload is not available.")
  }
  return row
}

export async function brandingPartUrl(schoolId: string, uploadId: string, partNumber: number) {
  const row = await ownedUpload(schoolId, uploadId)
  if (!row.multipartUploadId || row.status !== "pending") {
    throw new ApiError(409, "INVALID_STATE", "This upload is not a multipart upload.")
  }
  if (partNumber < 1 || partNumber > 100) {
    throw new ApiError(400, "VALIDATION_ERROR", "The part number is invalid.")
  }
  const storage = createStorageProvider(env)
  const presigned = await storage.createMultipartPartUrl(
    { bucket: env.STORAGE_BUCKET, key: row.objectKey, uploadId: row.multipartUploadId },
    partNumber,
  )
  return { presigned }
}

export async function completeBrandingUpload(
  schoolId: string,
  uploadId: string,
  actor: Actor,
  parts: Array<{ partNumber: number; eTag: string }> | undefined,
  meta: { ipAddress: string | null; userAgent: string | null; correlationId: string | null },
) {
  const row = await ownedUpload(schoolId, uploadId)
  if (row.status !== "pending") {
    throw new ApiError(409, "INVALID_STATE", "This upload is already finished.")
  }
  const storage = createStorageProvider(env)
  if (row.multipartUploadId) {
    if (!parts || parts.length === 0) {
      throw new ApiError(400, "VALIDATION_ERROR", "Multipart completion requires the uploaded parts.")
    }
    await storage.completeMultipartUpload(
      { bucket: env.STORAGE_BUCKET, key: row.objectKey, uploadId: row.multipartUploadId },
      parts,
    )
  }
  const metadata = await storage.getObjectMetadata({ bucket: env.STORAGE_BUCKET, key: row.objectKey })
  if (!metadata.size || metadata.size > row.contentLength || metadata.size > LIMITS[row.purpose]) {
    throw new ApiError(400, "FILE_TOO_LARGE", "The uploaded file does not match the declared size.")
  }
  const prefix = await storage.downloadObject({ bucket: env.STORAGE_BUCKET, key: row.objectKey })
  if (!magicOk(row.contentType, prefix)) {
    await storage.deleteObject({ bucket: env.STORAGE_BUCKET, key: row.objectKey })
    await getDb().update(storageUploads).set({ status: "failed" }).where(eq(storageUploads.id, row.id))
    throw new ApiError(400, "FILE_TYPE_NOT_ALLOWED", "The file contents do not match an allowed image type.")
  }
  const school = await loadSchool(schoolId)
  const previous = row.purpose === "logo" ? school.logoStorageKey : school.bannerStorageKey
  await getDb()
    .update(schools)
    .set(
      row.purpose === "logo"
        ? { logoStorageKey: row.objectKey, logoUpdatedAt: new Date(), updatedAt: new Date() }
        : { bannerStorageKey: row.objectKey, bannerUpdatedAt: new Date(), updatedAt: new Date() },
    )
    .where(eq(schools.id, schoolId))
  await getDb()
    .update(storageUploads)
    .set({ status: "completed", completedAt: new Date() })
    .where(eq(storageUploads.id, row.id))
  if (previous && previous !== row.objectKey && previous.startsWith(`tenants/${school.tenantId}/`)) {
    await storage.deleteObject({ bucket: env.STORAGE_BUCKET, key: previous }).catch(() => undefined)
  }
  const audit = {
    action: `school.branding_${row.purpose}_updated`,
    entityType: "school",
    entityId: schoolId,
    beforeData: { key: previous },
    afterData: { key: row.objectKey, contentType: row.contentType },
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    correlationId: meta.correlationId,
  }
  if (actor.kind === "platform_admin") {
    await insertAudit(getDb(), { actorAdminId: actor.id, ...audit })
  } else {
    await insertSchoolAudit(getDb(), { schoolId, actorAdminId: actor.id, ...audit })
  }
  return { purpose: row.purpose, objectKey: row.objectKey }
}

export async function abortBrandingUpload(schoolId: string, uploadId: string) {
  const row = await ownedUpload(schoolId, uploadId)
  if (row.multipartUploadId && row.status === "pending") {
    const storage = createStorageProvider(env)
    await storage.abortMultipartUpload({
      bucket: env.STORAGE_BUCKET,
      key: row.objectKey,
      uploadId: row.multipartUploadId,
    })
  }
  await getDb().update(storageUploads).set({ status: "aborted" }).where(eq(storageUploads.id, row.id))
}

export async function removeBranding(
  schoolId: string,
  purpose: "logo" | "banner",
  actor: Actor,
  meta: { ipAddress: string | null; userAgent: string | null; correlationId: string | null },
) {
  const school = await loadSchool(schoolId)
  const key = purpose === "logo" ? school.logoStorageKey : school.bannerStorageKey
  await getDb()
    .update(schools)
    .set(
      purpose === "logo"
        ? { logoStorageKey: null, logoUpdatedAt: new Date(), updatedAt: new Date() }
        : { bannerStorageKey: null, bannerUpdatedAt: new Date(), updatedAt: new Date() },
    )
    .where(eq(schools.id, schoolId))
  if (key && key.startsWith(`tenants/${school.tenantId}/`)) {
    await createStorageProvider(env).deleteObject({ bucket: env.STORAGE_BUCKET, key }).catch(() => undefined)
  }
  const audit = {
    action: `school.branding_${purpose}_removed`,
    entityType: "school",
    entityId: schoolId,
    beforeData: { key },
    afterData: { key: null },
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    correlationId: meta.correlationId,
  }
  if (actor.kind === "platform_admin") {
    await insertAudit(getDb(), { actorAdminId: actor.id, ...audit })
  } else {
    await insertSchoolAudit(getDb(), { schoolId, actorAdminId: actor.id, ...audit })
  }
}

export async function abortExpiredUploads(): Promise<number> {
  const rows = await getDb()
    .select()
    .from(storageUploads)
    .where(and(eq(storageUploads.status, "pending"), lt(storageUploads.expiresAt, new Date())))
    .limit(50)
  for (const row of rows) {
    if (row.multipartUploadId) {
      await createStorageProvider(env)
        .abortMultipartUpload({
          bucket: env.STORAGE_BUCKET,
          key: row.objectKey,
          uploadId: row.multipartUploadId,
        })
        .catch(() => undefined)
    }
    await getDb().update(storageUploads).set({ status: "aborted" }).where(eq(storageUploads.id, row.id))
  }
  return rows.length
}
