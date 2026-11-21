import { randomInt, randomUUID } from "node:crypto"

import { env } from "../../../config"
import { getDb } from "../../../db"
import type { ResolvedSchool } from "../../../middleware/tenant-host"
import { enqueueEmail } from "../../../queue/email-queue"
import { ApiError } from "../../platform/errors"
import { assertPasswordPolicy, hashPassword, verifyPassword } from "../../platform/auth/password"
import { insertSchoolAudit } from "../audit"
import * as repo from "./auth.repository"
import { normalizeEmail } from "./auth.schemas"
import {
  REFRESH_TTL_MS,
  createCsrfToken,
  createRefreshToken,
  createResetToken,
  hashOtp,
  hashRefreshToken,
  hashResetToken,
  otpMatches,
  signSchoolAccessToken,
} from "./token"

const GENERIC_LOGIN_ERROR = "The email or password is incorrect."
const GENERIC_RESET = "If an account exists for that email, a verification code has been sent."
const ATTEMPT_LIMIT = 5
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000
const RESET_HOUR_LIMIT = 5

export type PublicSchoolAdmin = {
  id: string
  email: string
  name: string
  status: "pending_invitation" | "active" | "disabled"
  mustChangePassword: boolean
  schoolId: string
  schoolCode: string
  schoolName: string
}

export type IssuedSession = {
  user: PublicSchoolAdmin
  accessToken: string
  refreshToken: string
  csrfToken: string
}

type RequestMeta = {
  ipAddress: string
  userAgent: string | null
  correlationId: string | null
}

function publicUser(user: repo.SchoolAdmin, school: ResolvedSchool): PublicSchoolAdmin {
  return {
    id: user.id,
    email: user.email,
    name: user.fullName,
    status: user.status,
    mustChangePassword: user.mustChangePassword,
    schoolId: school.id,
    schoolCode: school.schoolCode,
    schoolName: school.name,
  }
}

function assertSchoolOpen(school: ResolvedSchool): void {
  if (school.status !== "active" || school.tenantStatus !== "active") {
    throw new ApiError(403, "SCHOOL_UNAVAILABLE", "This school account is not available.")
  }
}

async function issueSession(
  user: repo.SchoolAdmin,
  school: ResolvedSchool,
  meta: RequestMeta,
  familyId: string = randomUUID(),
): Promise<IssuedSession> {
  const refreshToken = createRefreshToken()
  const session = await repo.insertSession(getDb(), {
    adminAccountId: user.id,
    schoolId: school.id,
    refreshTokenHash: hashRefreshToken(refreshToken, env.SCHOOL_ACCESS_TOKEN_SECRET),
    tokenFamilyId: familyId,
    userAgent: meta.userAgent,
    ipAddress: meta.ipAddress,
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
  })
  return {
    user: publicUser(user, school),
    refreshToken,
    csrfToken: createCsrfToken(),
    accessToken: signSchoolAccessToken(
      {
        sub: user.id,
        sid: session.id,
        fam: familyId,
        mcp: user.mustChangePassword,
        sch: school.id,
        ten: school.tenantId,
      },
      env.SCHOOL_ACCESS_TOKEN_SECRET,
    ),
  }
}

let cachedDummyHash: Promise<string> | null = null
function dummyHash(): Promise<string> {
  cachedDummyHash ??= hashPassword("timing-equalizer-not-a-credential")
  return cachedDummyHash
}

export async function login(
  school: ResolvedSchool,
  input: { email: string; password: string },
  meta: RequestMeta,
): Promise<IssuedSession> {
  assertSchoolOpen(school)
  const email = normalizeEmail(input.email)
  const db = getDb()
  const since = new Date(Date.now() - ATTEMPT_WINDOW_MS)
  const attempts = await repo.countRecentAttempts(db, school.id, email, meta.ipAddress, since)
  if (attempts >= ATTEMPT_LIMIT) {
    throw new ApiError(429, "RATE_LIMITED", "Too many attempts. Try again later.")
  }
  const user = await repo.findAdminByEmail(db, school.id, email)
  const passwordMatches =
    user && user.passwordHash
      ? await verifyPassword(input.password, user.passwordHash)
      : await verifyPassword(input.password, await dummyHash())
  if (user?.status === "disabled") {
    await repo.recordAttempt(db, school.id, email, meta.ipAddress)
    throw new ApiError(403, "ACCOUNT_DISABLED", "This account is disabled. Contact your platform administrator.")
  }
  if (!user || !user.passwordHash || !passwordMatches || user.status !== "active") {
    await repo.recordAttempt(db, school.id, email, meta.ipAddress)
    throw new ApiError(401, "INVALID_CREDENTIALS", GENERIC_LOGIN_ERROR)
  }
  await repo.clearAttempts(db, school.id, email, meta.ipAddress)
  await repo.markLogin(db, user.id)
  const issued = await issueSession(user, school, meta)
  await insertSchoolAudit(db, {
    schoolId: school.id,
    actorAdminId: user.id,
    action: "school_admin.login",
    entityType: "school_admin_account",
    entityId: user.id,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    correlationId: meta.correlationId,
  })
  return issued
}

export async function refresh(school: ResolvedSchool, refreshToken: string, meta: RequestMeta): Promise<IssuedSession> {
  assertSchoolOpen(school)
  const db = getDb()
  const session = await repo.findSessionByHash(db, hashRefreshToken(refreshToken, env.SCHOOL_ACCESS_TOKEN_SECRET))
  if (!session || session.schoolId !== school.id) {
    throw new ApiError(401, "INVALID_SESSION", "The session is no longer valid.")
  }
  if (session.revokedAt) {
    await repo.revokeFamily(db, session.tokenFamilyId)
    throw new ApiError(401, "INVALID_SESSION", "The session is no longer valid.")
  }
  if (session.expiresAt.getTime() <= Date.now()) {
    await repo.revokeSession(db, session.id)
    throw new ApiError(401, "INVALID_SESSION", "The session is no longer valid.")
  }
  const user = await repo.findAdminById(db, session.adminAccountId)
  if (!user || user.schoolId !== school.id || user.status !== "active") {
    await repo.revokeFamily(db, session.tokenFamilyId)
    throw new ApiError(401, "INVALID_SESSION", "The session is no longer valid.")
  }
  await repo.revokeSession(db, session.id)
  return issueSession(user, school, meta, session.tokenFamilyId)
}

export async function logout(
  school: ResolvedSchool,
  input: { refreshToken?: string; sessionId?: string },
  meta: RequestMeta,
): Promise<void> {
  const db = getDb()
  let session: repo.SchoolSession | null = null
  if (input.refreshToken) {
    session = await repo.findSessionByHash(db, hashRefreshToken(input.refreshToken, env.SCHOOL_ACCESS_TOKEN_SECRET))
  } else if (input.sessionId) {
    session = await repo.findSessionById(db, input.sessionId)
  }
  if (session && session.schoolId === school.id && !session.revokedAt) {
    await repo.revokeSession(db, session.id)
    await insertSchoolAudit(db, {
      schoolId: school.id,
      actorAdminId: session.adminAccountId,
      action: "school_admin.logout",
      entityType: "school_admin_session",
      entityId: session.id,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      correlationId: meta.correlationId,
    })
  }
}

export async function currentUser(school: ResolvedSchool, userId: string): Promise<PublicSchoolAdmin> {
  const user = await repo.findAdminById(getDb(), userId)
  if (!user || user.schoolId !== school.id || user.status !== "active") {
    throw new ApiError(401, "INVALID_SESSION", "The session is no longer valid.")
  }
  return publicUser(user, school)
}

export async function requireActiveSession(school: ResolvedSchool, sessionId: string, userId: string) {
  const session = await repo.findSessionById(getDb(), sessionId)
  if (
    !session ||
    session.adminAccountId !== userId ||
    session.schoolId !== school.id ||
    session.revokedAt ||
    session.expiresAt.getTime() <= Date.now()
  ) {
    throw new ApiError(401, "INVALID_SESSION", "The session is no longer valid.")
  }
  return currentUser(school, userId)
}

async function applyNewPassword(
  user: repo.SchoolAdmin,
  school: ResolvedSchool,
  newPassword: string,
  meta: RequestMeta,
  action: string,
): Promise<IssuedSession> {
  try {
    assertPasswordPolicy(newPassword)
  } catch {
    throw new ApiError(400, "PASSWORD_POLICY", "Use at least 12 characters with a letter and a number.")
  }
  const db = getDb()
  const history = user.passwordHash ? [user.passwordHash, ...(await repo.recentPasswordHashes(db, user.id))] : []
  for (const previous of history) {
    if (await verifyPassword(newPassword, previous)) {
      throw new ApiError(400, "PASSWORD_REUSE", "Choose a password that has not been used before.")
    }
  }
  const nextHash = await hashPassword(newPassword)
  if (user.passwordHash) {
    await repo.insertPasswordHistory(db, user.id, user.passwordHash)
  }
  await repo.updatePassword(db, user.id, nextHash, false)
  await repo.revokeAllForAdmin(db, user.id)
  const updated = await repo.findAdminById(db, user.id)
  if (!updated) {
    throw new ApiError(500, "INTERNAL_ERROR", "The request could not be completed.")
  }
  await insertSchoolAudit(db, {
    schoolId: school.id,
    actorAdminId: user.id,
    action,
    entityType: "school_admin_account",
    entityId: user.id,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    correlationId: meta.correlationId,
  })
  return issueSession(updated, school, meta)
}

export async function changePassword(
  school: ResolvedSchool,
  userId: string,
  input: { currentPassword: string; newPassword: string },
  meta: RequestMeta,
): Promise<IssuedSession> {
  const db = getDb()
  const user = await repo.findAdminById(db, userId)
  if (!user || user.schoolId !== school.id || user.status !== "active" || !user.passwordHash) {
    throw new ApiError(401, "INVALID_SESSION", "The session is no longer valid.")
  }
  const currentMatches = await verifyPassword(input.currentPassword, user.passwordHash)
  if (!currentMatches) {
    throw new ApiError(400, "INVALID_CREDENTIALS", "The current password is incorrect.")
  }
  if (input.currentPassword === input.newPassword) {
    throw new ApiError(400, "PASSWORD_REUSE", "Choose a password that has not been used before.")
  }
  return applyNewPassword(user, school, input.newPassword, meta, "school_admin.password_changed")
}

function loginUrl(school: ResolvedSchool): string {
  const code = school.schoolCode.toLowerCase()
  if (env.NODE_ENV === "production") {
    return `https://${code}.${env.SCHOOL_ADMIN_PRODUCTION_BASE_DOMAIN}/login`
  }
  return `http://${code}.${env.SCHOOL_ADMIN_LOCAL_BASE_DOMAIN}:${env.SCHOOL_ADMIN_LOCAL_PORT}/login`
}

export async function forgotPassword(school: ResolvedSchool, email: string, meta: RequestMeta): Promise<void> {
  assertSchoolOpen(school)
  const db = getDb()
  const normalized = normalizeEmail(email)
  const attempts = await repo.countRecentAttempts(db, school.id, normalized, meta.ipAddress, new Date(Date.now() - ATTEMPT_WINDOW_MS))
  if (attempts >= ATTEMPT_LIMIT) {
    throw new ApiError(429, "RATE_LIMITED", "Too many attempts. Try again later.")
  }
  await repo.recordAttempt(db, school.id, normalized, meta.ipAddress)
  const user = await repo.findAdminByEmail(db, school.id, normalized)
  if (!user || user.status === "disabled" || user.status === "pending_invitation") {
    return
  }
  const recent = await repo.countResetsSince(db, user.id, new Date(Date.now() - 60 * 60 * 1000))
  if (recent >= RESET_HOUR_LIMIT) {
    return
  }
  const latest = await repo.latestReset(db, user.id)
  if (latest && Date.now() - latest.createdAt.getTime() < env.OTP_RESEND_COOLDOWN_SECONDS * 1000) {
    return
  }
  const otp = randomInt(0, 1_000_000).toString().padStart(6, "0")
  await repo.invalidateOpenResets(db, user.id)
  await repo.insertReset(db, {
    schoolId: school.id,
    adminAccountId: user.id,
    otpHash: hashOtp(otp, env.SCHOOL_ACCESS_TOKEN_SECRET, school.id, user.id),
    expiresAt: new Date(Date.now() + env.OTP_TTL_SECONDS * 1000),
  })
  const text = [
    `Use this code to reset the School Admin password for ${school.name}.`,
    ``,
    `Code: ${otp}`,
    `It expires in ${Math.round(env.OTP_TTL_SECONDS / 60)} minutes.`,
    `If you did not request this, you can ignore this email.`,
  ].join("\n")
  await enqueueEmail({
    priority: "critical",
    jobType: "auth.password_reset_otp",
    to: user.email,
    subject: `${school.name} password reset code`,
    text,
    html: `<p>Use this code to reset the School Admin password for ${school.name}.</p><p><strong>${otp}</strong></p><p>It expires in ${Math.round(env.OTP_TTL_SECONDS / 60)} minutes.</p>`,
    idempotencyKey: `otp:${user.id}:${Date.now()}`,
    schoolId: school.id,
    correlationId: meta.correlationId,
    devOnlyOtp: otp,
  })
}

export async function verifyResetOtp(
  school: ResolvedSchool,
  email: string,
  otp: string,
): Promise<string> {
  assertSchoolOpen(school)
  const db = getDb()
  const user = await repo.findAdminByEmail(db, school.id, normalizeEmail(email))
  if (!user || user.status !== "active") {
    throw new ApiError(400, "INVALID_OTP", "The code is invalid or has expired.")
  }
  const reset = await repo.latestReset(db, user.id)
  if (!reset || reset.consumedAt || reset.schoolId !== school.id || reset.verifiedAt) {
    throw new ApiError(400, "INVALID_OTP", "The code is invalid or has expired.")
  }
  if (reset.expiresAt.getTime() <= Date.now()) {
    await repo.consumeReset(db, reset.id)
    throw new ApiError(400, "INVALID_OTP", "The code is invalid or has expired.")
  }
  if (reset.attempts >= env.OTP_MAX_ATTEMPTS) {
    await repo.consumeReset(db, reset.id)
    throw new ApiError(429, "RATE_LIMITED", "Too many attempts. Request a new code.")
  }
  if (!otpMatches(otp, reset.otpHash, env.SCHOOL_ACCESS_TOKEN_SECRET, school.id, user.id)) {
    await repo.incrementResetAttempts(db, reset.id)
    throw new ApiError(400, "INVALID_OTP", "The code is invalid or has expired.")
  }
  const token = createResetToken()
  await repo.markResetVerified(db, reset.id, hashResetToken(token, env.SCHOOL_ACCESS_TOKEN_SECRET), new Date(Date.now() + 10 * 60 * 1000))
  return token
}

export async function resetPassword(
  school: ResolvedSchool,
  resetToken: string,
  newPassword: string,
  confirmPassword: string,
  meta: RequestMeta,
): Promise<IssuedSession> {
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "VALIDATION_ERROR", "The passwords do not match.")
  }
  const db = getDb()
  const reset = await repo.findResetByTokenHash(db, hashResetToken(resetToken, env.SCHOOL_ACCESS_TOKEN_SECRET))
  if (
    !reset ||
    reset.consumedAt ||
    !reset.verifiedAt ||
    reset.schoolId !== school.id ||
    !reset.resetTokenExpiresAt ||
    reset.resetTokenExpiresAt.getTime() <= Date.now()
  ) {
    throw new ApiError(400, "INVALID_RESET", "The password reset session is no longer valid.")
  }
  const user = await repo.findAdminById(db, reset.adminAccountId)
  if (!user || user.schoolId !== school.id || user.status === "disabled") {
    throw new ApiError(400, "INVALID_RESET", "The password reset session is no longer valid.")
  }
  await repo.consumeReset(db, reset.id)
  return applyNewPassword(user, school, newPassword, meta, "school_admin.password_reset")
}

export function neutralResetMessage(): string {
  return GENERIC_RESET
}

export function buildWelcomeEmail(school: { name: string; schoolCode: string }, adminEmail: string): { subject: string; text: string; html: string } {
  const code = school.schoolCode.toLowerCase()
  const url =
    env.NODE_ENV === "production"
      ? `https://${code}.${env.SCHOOL_ADMIN_PRODUCTION_BASE_DOMAIN}/login`
      : `http://${code}.${env.SCHOOL_ADMIN_LOCAL_BASE_DOMAIN}:${env.SCHOOL_ADMIN_LOCAL_PORT}/login`
  const text = [
    `Welcome to ${school.name} on MMK School ERP.`,
    ``,
    `School code: ${school.schoolCode}`,
    `Administrator email: ${adminEmail}`,
    `Sign in: ${url}`,
    ``,
    `Your platform administrator set the initial password separately. It is not included in this email.`,
    `If you need help, contact ${env.SUPPORT_EMAIL}.`,
  ].join("\n")
  return {
    subject: `${school.name} School Admin account`,
    text,
    html: `<p>Welcome to ${school.name} on MMK School ERP.</p><p>School code: ${school.schoolCode}<br/>Administrator email: ${adminEmail}</p><p><a href="${url}">Sign in</a></p><p>Your platform administrator set the initial password separately. It is not included in this email.</p><p>Support: ${env.SUPPORT_EMAIL}</p>`,
  }
}

export { loginUrl }
