import { and, desc, eq, gt, isNull, sql } from "drizzle-orm"

import type { Database } from "../../../db"
import {
  schoolAdminAccounts,
  schoolAdminLoginAttempts,
  schoolAdminPasswordHistory,
  schoolAdminPasswordResets,
  schoolAdminSessions,
} from "../../../db/schema"

export type SchoolAdmin = typeof schoolAdminAccounts.$inferSelect
export type SchoolSession = typeof schoolAdminSessions.$inferSelect
export type PasswordReset = typeof schoolAdminPasswordResets.$inferSelect

export async function findAdminByEmail(
  db: Database,
  schoolId: string,
  email: string,
): Promise<SchoolAdmin | null> {
  const [row] = await db
    .select()
    .from(schoolAdminAccounts)
    .where(and(eq(schoolAdminAccounts.schoolId, schoolId), eq(schoolAdminAccounts.email, email)))
    .limit(1)
  return row ?? null
}

export async function findAdminById(db: Database, id: string): Promise<SchoolAdmin | null> {
  const [row] = await db.select().from(schoolAdminAccounts).where(eq(schoolAdminAccounts.id, id)).limit(1)
  return row ?? null
}

export async function countRecentAttempts(
  db: Database,
  schoolId: string,
  email: string,
  ipAddress: string,
  since: Date,
): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schoolAdminLoginAttempts)
    .where(
      and(
        eq(schoolAdminLoginAttempts.schoolId, schoolId),
        eq(schoolAdminLoginAttempts.email, email),
        eq(schoolAdminLoginAttempts.ipAddress, ipAddress),
        gt(schoolAdminLoginAttempts.createdAt, since),
      ),
    )
  return row?.count ?? 0
}

export async function recordAttempt(db: Database, schoolId: string, email: string, ipAddress: string): Promise<void> {
  await db.insert(schoolAdminLoginAttempts).values({ schoolId, email, ipAddress })
}

export async function clearAttempts(db: Database, schoolId: string, email: string, ipAddress: string): Promise<void> {
  await db
    .delete(schoolAdminLoginAttempts)
    .where(
      and(
        eq(schoolAdminLoginAttempts.schoolId, schoolId),
        eq(schoolAdminLoginAttempts.email, email),
        eq(schoolAdminLoginAttempts.ipAddress, ipAddress),
      ),
    )
}

export async function markLogin(db: Database, id: string): Promise<void> {
  await db
    .update(schoolAdminAccounts)
    .set({ lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(schoolAdminAccounts.id, id))
}

export async function insertSession(
  db: Database,
  values: {
    adminAccountId: string
    schoolId: string
    refreshTokenHash: string
    tokenFamilyId: string
    userAgent: string | null
    ipAddress: string
    expiresAt: Date
  },
): Promise<SchoolSession> {
  const [session] = await db.insert(schoolAdminSessions).values(values).returning()
  if (!session) {
    throw new Error("SESSION_INSERT_FAILED")
  }
  return session
}

export async function findSessionByHash(db: Database, hash: string): Promise<SchoolSession | null> {
  const [session] = await db
    .select()
    .from(schoolAdminSessions)
    .where(eq(schoolAdminSessions.refreshTokenHash, hash))
    .limit(1)
  return session ?? null
}

export async function findSessionById(db: Database, id: string): Promise<SchoolSession | null> {
  const [session] = await db.select().from(schoolAdminSessions).where(eq(schoolAdminSessions.id, id)).limit(1)
  return session ?? null
}

export async function revokeSession(db: Database, id: string): Promise<void> {
  await db
    .update(schoolAdminSessions)
    .set({ revokedAt: new Date() })
    .where(and(eq(schoolAdminSessions.id, id), isNull(schoolAdminSessions.revokedAt)))
}

export async function revokeFamily(db: Database, familyId: string): Promise<void> {
  await db
    .update(schoolAdminSessions)
    .set({ revokedAt: new Date() })
    .where(and(eq(schoolAdminSessions.tokenFamilyId, familyId), isNull(schoolAdminSessions.revokedAt)))
}

export async function revokeAllForAdmin(db: Database, adminAccountId: string): Promise<void> {
  await db
    .update(schoolAdminSessions)
    .set({ revokedAt: new Date() })
    .where(and(eq(schoolAdminSessions.adminAccountId, adminAccountId), isNull(schoolAdminSessions.revokedAt)))
}

export async function recentPasswordHashes(db: Database, adminAccountId: string): Promise<string[]> {
  const rows = await db
    .select({ passwordHash: schoolAdminPasswordHistory.passwordHash })
    .from(schoolAdminPasswordHistory)
    .where(eq(schoolAdminPasswordHistory.adminAccountId, adminAccountId))
    .orderBy(desc(schoolAdminPasswordHistory.createdAt))
    .limit(5)
  return rows.map((row) => row.passwordHash)
}

export async function insertPasswordHistory(db: Database, adminAccountId: string, passwordHash: string): Promise<void> {
  await db.insert(schoolAdminPasswordHistory).values({ adminAccountId, passwordHash })
}

export async function updatePassword(
  db: Database,
  adminAccountId: string,
  passwordHash: string,
  mustChangePassword: boolean,
): Promise<void> {
  await db
    .update(schoolAdminAccounts)
    .set({
      passwordHash,
      mustChangePassword,
      status: "active",
      updatedAt: new Date(),
    })
    .where(eq(schoolAdminAccounts.id, adminAccountId))
}

export async function latestReset(db: Database, adminAccountId: string): Promise<PasswordReset | null> {
  const [row] = await db
    .select()
    .from(schoolAdminPasswordResets)
    .where(eq(schoolAdminPasswordResets.adminAccountId, adminAccountId))
    .orderBy(desc(schoolAdminPasswordResets.createdAt))
    .limit(1)
  return row ?? null
}

export async function countResetsSince(db: Database, adminAccountId: string, since: Date): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schoolAdminPasswordResets)
    .where(and(eq(schoolAdminPasswordResets.adminAccountId, adminAccountId), gt(schoolAdminPasswordResets.createdAt, since)))
  return row?.count ?? 0
}

export async function invalidateOpenResets(db: Database, adminAccountId: string): Promise<void> {
  await db
    .update(schoolAdminPasswordResets)
    .set({ consumedAt: new Date() })
    .where(and(eq(schoolAdminPasswordResets.adminAccountId, adminAccountId), isNull(schoolAdminPasswordResets.consumedAt)))
}

export async function insertReset(
  db: Database,
  values: {
    schoolId: string
    adminAccountId: string
    otpHash: string
    expiresAt: Date
  },
): Promise<PasswordReset> {
  const [row] = await db.insert(schoolAdminPasswordResets).values(values).returning()
  if (!row) {
    throw new Error("RESET_INSERT_FAILED")
  }
  return row
}

export async function incrementResetAttempts(db: Database, id: string): Promise<void> {
  await db
    .update(schoolAdminPasswordResets)
    .set({ attempts: sql`${schoolAdminPasswordResets.attempts} + 1` })
    .where(eq(schoolAdminPasswordResets.id, id))
}

export async function markResetVerified(
  db: Database,
  id: string,
  resetTokenHash: string,
  resetTokenExpiresAt: Date,
): Promise<void> {
  await db
    .update(schoolAdminPasswordResets)
    .set({ verifiedAt: new Date(), resetTokenHash, resetTokenExpiresAt })
    .where(eq(schoolAdminPasswordResets.id, id))
}

export async function findResetByTokenHash(db: Database, hash: string): Promise<PasswordReset | null> {
  const [row] = await db
    .select()
    .from(schoolAdminPasswordResets)
    .where(eq(schoolAdminPasswordResets.resetTokenHash, hash))
    .limit(1)
  return row ?? null
}

export async function consumeReset(db: Database, id: string): Promise<void> {
  await db
    .update(schoolAdminPasswordResets)
    .set({ consumedAt: new Date() })
    .where(eq(schoolAdminPasswordResets.id, id))
}
