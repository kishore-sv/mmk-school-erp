import { randomUUID } from "node:crypto"

import { env } from "../../../config"
import { getDb } from "../../../db"
import { insertAudit } from "../audit/audit.repository"
import { ApiError } from "../errors"
import * as repo from "./auth.repository"
import { normalizeEmail } from "./auth.schemas"
import {
  assertPasswordPolicy,
  hashPassword,
  verifyPassword,
} from "./password"
import {
  REFRESH_TTL_MS,
  createCsrfToken,
  createRefreshToken,
  hashRefreshToken,
  signAccessToken,
} from "./token"

const GENERIC_LOGIN_ERROR = "The email or password is incorrect."
const ATTEMPT_LIMIT = 5
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000

export type PublicAdmin = {
  id: string
  email: string
  name: string
  status: "active" | "disabled"
  mustChangePassword: boolean
}

export type IssuedSession = {
  user: PublicAdmin
  accessToken: string
  refreshToken: string
  csrfToken: string
}

type RequestMeta = {
  ipAddress: string
  userAgent: string | null
  correlationId: string | null
}

function publicUser(user: repo.AdminUser): PublicAdmin {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    status: user.status,
    mustChangePassword: user.mustChangePassword,
  }
}

async function issueSession(
  user: repo.AdminUser,
  meta: RequestMeta,
  familyId: string = randomUUID(),
): Promise<IssuedSession> {
  const refreshToken = createRefreshToken()
  const session = await repo.insertSession(getDb(), {
    adminUserId: user.id,
    refreshTokenHash: hashRefreshToken(refreshToken, env.PLATFORM_ACCESS_TOKEN_SECRET),
    tokenFamilyId: familyId as repo.AdminSession["tokenFamilyId"],
    userAgent: meta.userAgent,
    ipAddress: meta.ipAddress,
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
  })
  return {
    user: publicUser(user),
    refreshToken,
    csrfToken: createCsrfToken(),
    accessToken: signAccessToken(
      {
        sub: user.id,
        sid: session.id,
        fam: familyId,
        mcp: user.mustChangePassword,
      },
      env.PLATFORM_ACCESS_TOKEN_SECRET,
    ),
  }
}

export async function login(
  input: { email: string; password: string },
  meta: RequestMeta,
): Promise<IssuedSession> {
  const email = normalizeEmail(input.email)
  const db = getDb()
  const since = new Date(Date.now() - ATTEMPT_WINDOW_MS)
  const attempts = await repo.countRecentAttempts(
    db,
    email,
    meta.ipAddress,
    since,
  )
  if (attempts >= ATTEMPT_LIMIT) {
    throw new ApiError(429, "RATE_LIMITED", "Too many attempts. Try again later.")
  }

  const user = await repo.findUserByEmail(db, email)
  const passwordMatches = user
    ? await verifyPassword(input.password, user.passwordHash)
    : await verifyPassword(input.password, await dummyHash())

  if (!user || !passwordMatches || user.status !== "active" || user.archivedAt) {
    await repo.recordAttempt(db, email, meta.ipAddress)
    throw new ApiError(401, "INVALID_CREDENTIALS", GENERIC_LOGIN_ERROR)
  }

  await repo.clearAttempts(db, email, meta.ipAddress)
  await repo.markLogin(db, user.id)
  const issued = await issueSession(user, meta)
  await insertAudit(db, {
    actorAdminId: user.id,
    action: "platform_admin.login",
    entityType: "platform_admin_user",
    entityId: user.id,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    correlationId: meta.correlationId,
  })
  return issued
}

let cachedDummyHash: Promise<string> | null = null

function dummyHash(): Promise<string> {
  cachedDummyHash ??= hashPassword("timing-equalizer-not-a-credential")
  return cachedDummyHash
}

export async function refresh(
  refreshToken: string,
  meta: RequestMeta,
): Promise<IssuedSession> {
  const db = getDb()
  const hash = hashRefreshToken(refreshToken, env.PLATFORM_ACCESS_TOKEN_SECRET)
  const session = await repo.findSessionByHash(db, hash)
  if (!session) {
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
  const user = await repo.findUserById(db, session.adminUserId)
  if (!user || user.status !== "active" || user.archivedAt) {
    await repo.revokeFamily(db, session.tokenFamilyId)
    throw new ApiError(401, "INVALID_SESSION", "The session is no longer valid.")
  }
  await repo.revokeSession(db, session.id)
  return issueSession(user, meta, session.tokenFamilyId)
}

export async function logout(
  input: { refreshToken?: string; sessionId?: string },
  meta: RequestMeta,
): Promise<void> {
  const db = getDb()
  let session: repo.AdminSession | null = null
  if (input.refreshToken) {
    session = await repo.findSessionByHash(
      db,
      hashRefreshToken(input.refreshToken, env.PLATFORM_ACCESS_TOKEN_SECRET),
    )
  } else if (input.sessionId) {
    session = await repo.findSessionById(db, input.sessionId)
  }
  if (session && !session.revokedAt) {
    await repo.revokeSession(db, session.id)
    await insertAudit(db, {
      actorAdminId: session.adminUserId,
      action: "platform_admin.logout",
      entityType: "platform_admin_session",
      entityId: session.id,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      correlationId: meta.correlationId,
    })
  }
}

export async function currentUser(userId: string): Promise<PublicAdmin> {
  const user = await repo.findUserById(getDb(), userId)
  if (!user || user.status !== "active" || user.archivedAt) {
    throw new ApiError(401, "INVALID_SESSION", "The session is no longer valid.")
  }
  return publicUser(user)
}

export async function changePassword(
  userId: string,
  input: { currentPassword: string; newPassword: string },
  meta: RequestMeta,
): Promise<IssuedSession> {
  try {
    assertPasswordPolicy(input.newPassword)
  } catch {
    throw new ApiError(
      400,
      "PASSWORD_POLICY",
      "Use at least 12 characters with a letter and a number.",
    )
  }
  const db = getDb()
  const user = await repo.findUserById(db, userId)
  if (!user || user.status !== "active") {
    throw new ApiError(401, "INVALID_SESSION", "The session is no longer valid.")
  }
  const currentMatches = await verifyPassword(
    input.currentPassword,
    user.passwordHash,
  )
  if (!currentMatches) {
    throw new ApiError(400, "INVALID_CREDENTIALS", "The current password is incorrect.")
  }
  if (input.currentPassword === input.newPassword) {
    throw new ApiError(
      400,
      "PASSWORD_REUSE",
      "Choose a password that has not been used before.",
    )
  }
  const history = await repo.recentPasswordHashes(db, user.id)
  for (const previous of [user.passwordHash, ...history]) {
    if (await verifyPassword(input.newPassword, previous)) {
      throw new ApiError(
        400,
        "PASSWORD_REUSE",
        "Choose a password that has not been used before.",
      )
    }
  }
  const nextHash = await hashPassword(input.newPassword)
  await repo.insertPasswordHistory(db, user.id, user.passwordHash)
  await repo.updatePassword(db, user.id, nextHash)
  await repo.revokeAllForUser(db, user.id)
  const updated = await repo.findUserById(db, user.id)
  if (!updated) {
    throw new ApiError(500, "INTERNAL_ERROR", "The request could not be completed.")
  }
  await insertAudit(db, {
    actorAdminId: user.id,
    action: "platform_admin.password_changed",
    entityType: "platform_admin_user",
    entityId: user.id,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    correlationId: meta.correlationId,
  })
  return issueSession(updated, meta)
}

export async function requireActiveSession(sessionId: string, userId: string) {
  const session = await repo.findSessionById(getDb(), sessionId)
  if (
    !session ||
    session.adminUserId !== userId ||
    session.revokedAt ||
    session.expiresAt.getTime() <= Date.now()
  ) {
    throw new ApiError(401, "INVALID_SESSION", "The session is no longer valid.")
  }
  return currentUser(userId)
}
