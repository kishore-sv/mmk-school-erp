import { randomBytes } from "node:crypto"
import { and, desc, eq, gt, isNotNull, isNull } from "drizzle-orm"

import { getDb } from "../../../db"
import { platformAdminSchoolActionVerifications } from "../../../db/schema"
import { enqueueEmail } from "../../../queue/email-queue"
import { findUserById } from "../auth/auth.repository"
import { hashPassword, verifyPassword } from "../auth/password"
import { ApiError } from "../errors"
import { getSchool } from "./schools.service"

const OTP_TTL_MS = 10 * 60 * 1000
const TOKEN_TTL_MS = 5 * 60 * 1000
const RESEND_COOLDOWN_MS = 60 * 1000
const MAX_ATTEMPTS = 5

type LifecycleAction = "suspend" | "archive"

function generateOtpCode(): string {
  if (process.env.PLATFORM_OTP_DEV_CODE) {
    return process.env.PLATFORM_OTP_DEV_CODE
  }
  return String(Math.floor(100000 + Math.random() * 900000))
}

function assertActionAllowed(
  status: string,
  action: LifecycleAction,
): void {
  if (action === "suspend" && status !== "active") {
    throw new ApiError(409, "INVALID_STATE", "Only an active school can be suspended.")
  }
  if (action === "archive" && status === "archived") {
    throw new ApiError(409, "INVALID_STATE", "The school is already archived.")
  }
}

async function queueOtpEmail(params: {
  recipient: string
  schoolName: string
  action: LifecycleAction
  code: string
  verificationId: string
  correlationId?: string | null
}) {
  const subject =
    params.action === "suspend"
      ? `Verify suspend: ${params.schoolName}`
      : `Verify archive: ${params.schoolName}`

  await enqueueEmail({
    priority: "critical",
    jobType: "platform_admin_lifecycle_otp",
    to: params.recipient,
    subject,
    text: `Verification code: ${params.code}\nThis code expires in 10 minutes.`,
    html: `<p>Verification code: <strong>${params.code}</strong></p>`,
    idempotencyKey: `platform-lifecycle-otp:${params.verificationId}`,
    correlationId: params.correlationId,
    devOnlyOtp: params.code,
  })
}

async function latestOpenChallenge(
  adminId: string,
  schoolId: string,
  action: LifecycleAction,
) {
  const [row] = await getDb()
    .select()
    .from(platformAdminSchoolActionVerifications)
    .where(
      and(
        eq(platformAdminSchoolActionVerifications.adminId, adminId),
        eq(platformAdminSchoolActionVerifications.schoolId, schoolId),
        eq(platformAdminSchoolActionVerifications.action, action),
        isNull(platformAdminSchoolActionVerifications.consumedAt),
      ),
    )
    .orderBy(desc(platformAdminSchoolActionVerifications.createdAt))
    .limit(1)
  return row ?? null
}

export async function requestSchoolLifecycleOtp(
  adminId: string,
  schoolId: string,
  action: LifecycleAction,
  meta: { correlationId?: string | null },
) {
  const admin = await findUserById(getDb(), adminId)
  if (!admin) {
    throw new ApiError(401, "UNAUTHENTICATED", "Sign in to continue.")
  }

  const school = await getSchool(schoolId)
  assertActionAllowed(school.status, action)

  const latest = await latestOpenChallenge(adminId, schoolId, action)
  if (
    latest &&
    Date.now() - latest.createdAt.getTime() < RESEND_COOLDOWN_MS
  ) {
    throw new ApiError(
      429,
      "OTP_COOLDOWN",
      "Wait a minute before requesting another verification code.",
    )
  }

  const code = generateOtpCode()
  const otpHash = await hashPassword(code)
  const expiresAt = new Date(Date.now() + OTP_TTL_MS)

  const [verification] = await getDb()
    .insert(platformAdminSchoolActionVerifications)
    .values({
      adminId,
      schoolId,
      action,
      otpHash,
      expiresAt,
    })
    .returning()
  if (!verification) {
    throw new ApiError(500, "INTERNAL_ERROR", "The request could not be completed.")
  }

  await queueOtpEmail({
    recipient: admin.email,
    schoolName: school.name,
    action,
    code,
    verificationId: verification.id,
    correlationId: meta.correlationId,
  })

  return {
    expiresAt: expiresAt.toISOString(),
    delivery: "queued" as const,
    maskedEmail: admin.email.replace(/(^.).*(@.*$)/, "$1***$2"),
  }
}

export async function verifySchoolLifecycleOtp(
  adminId: string,
  schoolId: string,
  action: LifecycleAction,
  code: string,
) {
  const row = await latestOpenChallenge(adminId, schoolId, action)
  if (!row) {
    throw new ApiError(
      400,
      "OTP_NOT_FOUND",
      "Request a verification code before continuing.",
    )
  }
  if (row.expiresAt.getTime() < Date.now()) {
    throw new ApiError(400, "OTP_EXPIRED", "The verification code has expired.")
  }
  if (row.attempts >= MAX_ATTEMPTS) {
    throw new ApiError(
      429,
      "OTP_LOCKED",
      "Too many incorrect attempts. Request a new code.",
    )
  }

  const matches = await verifyPassword(code, row.otpHash)
  if (!matches) {
    await getDb()
      .update(platformAdminSchoolActionVerifications)
      .set({ attempts: row.attempts + 1 })
      .where(eq(platformAdminSchoolActionVerifications.id, row.id))
    throw new ApiError(401, "OTP_INVALID", "The verification code is incorrect.")
  }

  const verificationToken = randomBytes(32).toString("base64url")
  const verificationTokenHash = await hashPassword(verificationToken)
  const verificationTokenExpiresAt = new Date(Date.now() + TOKEN_TTL_MS)
  const verifiedAt = new Date()

  await getDb()
    .update(platformAdminSchoolActionVerifications)
    .set({
      verifiedAt,
      verificationTokenHash,
      verificationTokenExpiresAt,
    })
    .where(eq(platformAdminSchoolActionVerifications.id, row.id))

  return {
    verificationToken,
    expiresAt: verificationTokenExpiresAt.toISOString(),
  }
}

export async function consumeSchoolLifecycleVerification(
  adminId: string,
  schoolId: string,
  action: LifecycleAction,
  verificationToken: string,
) {
  const now = new Date()
  const [row] = await getDb()
    .select()
    .from(platformAdminSchoolActionVerifications)
    .where(
      and(
        eq(platformAdminSchoolActionVerifications.adminId, adminId),
        eq(platformAdminSchoolActionVerifications.schoolId, schoolId),
        eq(platformAdminSchoolActionVerifications.action, action),
        isNull(platformAdminSchoolActionVerifications.consumedAt),
        isNotNull(platformAdminSchoolActionVerifications.verificationTokenHash),
        isNotNull(platformAdminSchoolActionVerifications.verificationTokenExpiresAt),
        gt(platformAdminSchoolActionVerifications.verificationTokenExpiresAt, now),
      ),
    )
    .orderBy(desc(platformAdminSchoolActionVerifications.createdAt))
    .limit(1)

  if (
    !row ||
    !row.verificationTokenHash ||
    !row.verifiedAt ||
    !row.verificationTokenExpiresAt
  ) {
    throw new ApiError(
      403,
      "VERIFICATION_REQUIRED",
      "Email verification is required before this action.",
    )
  }

  const tokenMatches = await verifyPassword(
    verificationToken,
    row.verificationTokenHash,
  )
  if (!tokenMatches) {
    throw new ApiError(
      403,
      "VERIFICATION_INVALID",
      "The verification has expired. Request a new code.",
    )
  }

  await getDb()
    .update(platformAdminSchoolActionVerifications)
    .set({ consumedAt: now })
    .where(eq(platformAdminSchoolActionVerifications.id, row.id))
}