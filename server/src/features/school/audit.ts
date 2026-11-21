import type { Database } from "../../db"
import { schoolAdminAuditLogs } from "../../db/schema"

export async function insertSchoolAudit(
  db: Database,
  values: {
    schoolId: string
    actorAdminId?: string | null
    action: string
    entityType: string
    entityId?: string | null
    beforeData?: unknown
    afterData?: unknown
    ipAddress?: string | null
    userAgent?: string | null
    correlationId?: string | null
  },
): Promise<void> {
  await db.insert(schoolAdminAuditLogs).values({
    schoolId: values.schoolId,
    actorAdminId: values.actorAdminId ?? null,
    action: values.action,
    entityType: values.entityType,
    entityId: values.entityId ?? null,
    beforeData: values.beforeData ?? null,
    afterData: values.afterData ?? null,
    ipAddress: values.ipAddress ?? null,
    userAgent: values.userAgent ?? null,
    correlationId: values.correlationId ?? null,
  })
}
