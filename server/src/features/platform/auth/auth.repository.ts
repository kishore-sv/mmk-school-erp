import { and, desc, eq, gt, isNull, sql } from "drizzle-orm"

import type { Database } from "../../../db"
import {
  platformAdminLoginAttempts,
  platformAdminPasswordHistory,
  platformAdminSessions,
  platformAdminUsers,
} from "../../../db/schema"

export type AdminUser = typeof platformAdminUsers.$inferSelect
export type AdminSession = typeof platformAdminSessions.$inferSelect

export async function findUserByEmail(
  db: Database,
  email: string,
): Promise<AdminUser | null> {
  const [user] = await db
    .select()
    .from(platformAdminUsers)
    .where(eq(platformAdminUsers.email, email))
    .limit(1)
  return user ?? null
}

export async function findUserById(
  db: Database,
  id: string,
): Promise<AdminUser | null> {
  const [user] = await db
    .select()
    .from(platformAdminUsers)
    .where(eq(platformAdminUsers.id, id))
    .limit(1)
  return user ?? null
}

export async function countRecentAttempts(
  db: Database,
  email: string,
  ipAddress: string,
  since: Date,
): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(platformAdminLoginAttempts)
    .where(
      and(
        eq(platformAdminLoginAttempts.email, email),
        eq(platformAdminLoginAttempts.ipAddress, ipAddress),
        gt(platformAdminLoginAttempts.createdAt, since),
      ),
    )
  return row?.count ?? 0
}

export async function recordAttempt(
  db: Database,
  email: string,
  ipAddress: string,
): Promise<void> {
  await db.insert(platformAdminLoginAttempts).values({ email, ipAddress })
}

export async function clearAttempts(
  db: Database,
  email: string,
  ipAddress: string,
): Promise<void> {
  await db
    .delete(platformAdminLoginAttempts)
    .where(
      and(
        eq(platformAdminLoginAttempts.email, email),
        eq(platformAdminLoginAttempts.ipAddress, ipAddress),
      ),
    )
}

export async function insertSession(
  db: Database,
  input: {
    adminUserId: string
    refreshTokenHash: string
    tokenFamilyId: AdminSession["tokenFamilyId"]
    userAgent: string | null
    ipAddress: string | null
    expiresAt: Date
  },
): Promise<AdminSession> {
  const [session] = await db
    .insert(platformAdminSessions)
    .values(input)
    .returning()
  if (!session) {
    throw new Error("SESSION_INSERT_FAILED")
  }
  return session
}

export async function findSessionByHash(
  db: Database,
  refreshTokenHash: string,
): Promise<AdminSession | null> {
  const [session] = await db
    .select()
    .from(platformAdminSessions)
    .where(eq(platformAdminSessions.refreshTokenHash, refreshTokenHash))
    .limit(1)
  return session ?? null
}

export async function findSessionById(
  db: Database,
  id: string,
): Promise<AdminSession | null> {
  const sessionId = id as AdminSession["id"]
  const [session] = await db
    .select()
    .from(platformAdminSessions)
    .where(eq(platformAdminSessions.id, sessionId))
    .limit(1)
  return session ?? null
}

export async function revokeSession(db: Database, id: string): Promise<void> {
  await db
    .update(platformAdminSessions)
    .set({ revokedAt: new Date() })
    .where(and(eq(platformAdminSessions.id, id), isNull(platformAdminSessions.revokedAt)))
}

export async function revokeFamily(db: Database, familyId: string): Promise<void> {
  await db
    .update(platformAdminSessions)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(platformAdminSessions.tokenFamilyId, familyId),
        isNull(platformAdminSessions.revokedAt),
      ),
    )
}

export async function revokeAllForUser(
  db: Database,
  adminUserId: string,
): Promise<void> {
  await db
    .update(platformAdminSessions)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(platformAdminSessions.adminUserId, adminUserId),
        isNull(platformAdminSessions.revokedAt),
      ),
    )
}

export async function markLogin(
  db: Database,
  userId: string,
): Promise<void> {
  await db
    .update(platformAdminUsers)
    .set({ lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(platformAdminUsers.id, userId))
}

export async function updatePassword(
  db: Database,
  userId: string,
  passwordHash: string,
): Promise<void> {
  await db
    .update(platformAdminUsers)
    .set({
      passwordHash,
      mustChangePassword: false,
      updatedAt: new Date(),
    })
    .where(eq(platformAdminUsers.id, userId))
}

export async function recentPasswordHashes(
  db: Database,
  userId: string,
): Promise<string[]> {
  const rows = await db
    .select({ passwordHash: platformAdminPasswordHistory.passwordHash })
    .from(platformAdminPasswordHistory)
    .where(eq(platformAdminPasswordHistory.adminUserId, userId))
    .orderBy(desc(platformAdminPasswordHistory.createdAt))
    .limit(5)
  return rows.map((row) => row.passwordHash)
}

export async function insertPasswordHistory(
  db: Database,
  userId: string,
  passwordHash: string,
): Promise<void> {
  await db.insert(platformAdminPasswordHistory).values({
    adminUserId: userId,
    passwordHash,
  })
}

export async function insertUser(
  db: Database,
  input: {
    email: string
    passwordHash: string
    name: string
    mustChangePassword: boolean
  },
): Promise<AdminUser> {
  const [user] = await db.insert(platformAdminUsers).values(input).returning()
  if (!user) {
    throw new Error("USER_INSERT_FAILED")
  }
  return user
}
