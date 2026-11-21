import { RedisClient } from "bun"
import { eq } from "drizzle-orm"

import { env } from "../config"
import { getDb } from "../db"
import { emailJobs, schoolAdminAccounts } from "../db/schema"
import type { EmailJobPayload, EmailPriority } from "../email/types"
import { log } from "../utils/logger"

const READY_KEY = "mmk:email:ready"
const PAYLOAD_PREFIX = "mmk:email:payload:"
const IDEM_PREFIX = "mmk:email:idem:"

const RANK: Record<EmailPriority, number> = {
  critical: 1,
  high: 2,
  normal: 3,
  low: 4,
}

let client: RedisClient | null = null

function redis(): RedisClient {
  client ??= new RedisClient(env.REDIS_URL)
  return client
}

function score(priority: EmailPriority, availableAt: number): number {
  return RANK[priority] * 1e15 + availableAt
}

export type EnqueueEmailInput = {
  priority: EmailPriority
  jobType: string
  to: string
  subject: string
  text: string
  html: string
  idempotencyKey: string
  schoolId?: string | null
  correlationId?: string | null
  devOnlyOtp?: string
  maxAttempts?: number
}

export async function enqueueEmail(input: EnqueueEmailInput): Promise<string | null> {
  const db = getDb()
  const existing = await db
    .select({ id: emailJobs.id })
    .from(emailJobs)
    .where(eq(emailJobs.idempotencyKey, input.idempotencyKey))
    .limit(1)
  if (existing[0]) {
    return existing[0].id
  }
  const redacted = {
    jobType: input.jobType,
    to: input.to,
    subject: input.subject,
    hasOtp: Boolean(input.devOnlyOtp),
  }
  const [row] = await db
    .insert(emailJobs)
    .values({
      priority: input.priority,
      jobType: input.jobType,
      status: "queued",
      idempotencyKey: input.idempotencyKey,
      schoolId: input.schoolId ?? null,
      recipient: input.to,
      subject: input.subject,
      payload: redacted,
      maxAttempts: input.maxAttempts ?? 5,
      correlationId: input.correlationId ?? null,
    })
    .returning()
  if (!row) {
    return null
  }
  const payload: EmailJobPayload = {
    id: row.id,
    emailJobId: row.id,
    priority: input.priority,
    jobType: input.jobType,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
    idempotencyKey: input.idempotencyKey,
    attempt: 0,
    maxAttempts: row.maxAttempts,
    correlationId: input.correlationId ?? null,
    ...(env.NODE_ENV === "development" && input.devOnlyOtp ? { devOnlyOtp: input.devOnlyOtp } : {}),
  }
  try {
    const connection = redis()
    const reserved = await connection.send("SET", [IDEM_PREFIX + input.idempotencyKey, row.id, "NX", "EX", "86400"])
    if (reserved !== "OK" && reserved !== null) {
      return row.id
    }
    await connection.send("SET", [PAYLOAD_PREFIX + row.id, JSON.stringify(payload), "EX", "86400"])
    await connection.send("ZADD", [READY_KEY, String(score(input.priority, Date.now())), row.id])
    if (input.jobType === "school.welcome" && input.schoolId) {
      await db
        .update(schoolAdminAccounts)
        .set({ invitationDelivery: "queued", updatedAt: new Date() })
        .where(eq(schoolAdminAccounts.schoolId, input.schoolId))
    }
    return row.id
  } catch (error) {
    log("error", "email enqueue failed", { jobId: row.id, error: error instanceof Error ? error.name : "unknown" })
    await db
      .update(emailJobs)
      .set({ status: "failed", lastError: "Queue unavailable.", updatedAt: new Date() })
      .where(eq(emailJobs.id, row.id))
    if (input.jobType === "school.welcome" && input.schoolId) {
      await db
        .update(schoolAdminAccounts)
        .set({ invitationDelivery: "failed", updatedAt: new Date() })
        .where(eq(schoolAdminAccounts.schoolId, input.schoolId))
    }
    return row.id
  }
}

export async function pingQueue(): Promise<boolean> {
  try {
    const pong = await redis().send("PING", [])
    return pong === "PONG"
  } catch {
    return false
  }
}

export function priorityRank(priority: EmailPriority): number {
  return RANK[priority]
}
