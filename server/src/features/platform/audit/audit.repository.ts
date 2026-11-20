import type { Database } from "../../../db"
import { platformAdminAuditLogs } from "../../../db/schema"

export type AuditInput = {
  actorAdminId?: string | null
  action: string
  entityType: string
  entityId?: string | null
  beforeData?: unknown
  afterData?: unknown
  reason?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  correlationId?: string | null
}

const secretKeys = new Set([
  "password",
  "passwordHash",
  "currentPassword",
  "newPassword",
  "accessToken",
  "refreshToken",
  "csrfToken",
])

export function redact(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => redact(item))
  }
  if (!value || typeof value !== "object") {
    return value
  }
  const output: Record<string, unknown> = {}
  for (const [key, entry] of Object.entries(value)) {
    output[key] = secretKeys.has(key) ? "[redacted]" : redact(entry)
  }
  return output
}

export async function insertAudit(
  db: Pick<Database, "insert">,
  input: AuditInput,
): Promise<void> {
  await db.insert(platformAdminAuditLogs).values({
    actorAdminId: input.actorAdminId ?? null,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId ?? null,
    beforeData: redact(input.beforeData ?? null),
    afterData: redact(input.afterData ?? null),
    reason: input.reason ?? null,
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
    correlationId: input.correlationId ?? null,
  })
}
