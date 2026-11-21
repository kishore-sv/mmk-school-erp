import { desc, sql } from "drizzle-orm"

import { checkDatabase } from "../../../db"
import { getDb } from "../../../db"
import {
  platformAdminAuditLogs,
  schoolCommercialTerms,
  schools,
} from "../../../db/schema"
import { createStorageProvider } from "../../../storage"
import { env } from "../../../config"

export async function getDashboard() {
  const db = getDb()
  const [counts] = await db
    .select({
      total: sql<number>`count(*)::int`,
      active: sql<number>`count(*) filter (where ${schools.status} = 'active')::int`,
      suspended: sql<number>`count(*) filter (where ${schools.status} = 'suspended')::int`,
      pendingProvisioning: sql<number>`count(*) filter (where ${schools.provisioningStatus} <> 'ready')::int`,
    })
    .from(schools)
  const [subscriptions] = await db
    .select({
      active: sql<number>`count(*) filter (where ${schoolCommercialTerms.status} = 'active')::int`,
    })
    .from(schoolCommercialTerms)
  const recentSchools = await db
    .select({
      id: schools.id,
      name: schools.name,
      schoolCode: schools.schoolCode,
      status: schools.status,
      createdAt: schools.createdAt,
    })
    .from(schools)
    .orderBy(desc(schools.createdAt))
    .limit(5)
  const recentActivity = await db
    .select({
      id: platformAdminAuditLogs.id,
      action: platformAdminAuditLogs.action,
      entityType: platformAdminAuditLogs.entityType,
      entityId: platformAdminAuditLogs.entityId,
      createdAt: platformAdminAuditLogs.createdAt,
    })
    .from(platformAdminAuditLogs)
    .orderBy(desc(platformAdminAuditLogs.createdAt))
    .limit(8)

  const { pingQueue } = await import("../../../queue/email-queue")
  const [postgres, storage, queueUp] = await Promise.all([
    checkDatabase(),
    createStorageProvider(env).checkAvailability(),
    pingQueue(),
  ])

  return {
    schools: {
      total: counts?.total ?? 0,
      active: counts?.active ?? 0,
      suspended: counts?.suspended ?? 0,
      pendingProvisioning: counts?.pendingProvisioning ?? 0,
    },
    people: {
      students: null,
      teachers: null,
      available: false,
    },
    subscriptions: {
      active: subscriptions?.active ?? 0,
    },
    payments: {
      outstanding: null,
      available: false,
    },
    recentSchools,
    recentActivity,
    health: {
      postgres: postgres ? "up" : "down",
      storage: storage ? "up" : "down",
      queue: queueUp ? "up" : "down",
    },
  }
}
