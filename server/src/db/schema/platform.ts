import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

export const platformAdminStatus = pgEnum("platform_admin_status", [
  "active",
  "disabled",
])

export const tenantStatus = pgEnum("tenant_status", ["active", "archived"])

export const schoolStatus = pgEnum("school_status", [
  "active",
  "suspended",
  "archived",
])

export const provisioningStatus = pgEnum("school_provisioning_status", [
  "ready",
  "failed",
])

export const commercialStatus = pgEnum("school_commercial_status", [
  "scheduled",
  "active",
  "ended",
])

export const billingModel = pgEnum("school_billing_model", [
  "per_student",
  "custom",
])

export const billingFrequency = pgEnum("school_billing_frequency", [
  "monthly",
  "quarterly",
  "annual",
  "custom",
])

export const schoolAdminInviteStatus = pgEnum("school_admin_invite_status", [
  "pending_invitation",
  "active",
  "disabled",
])

export const invitationDeliveryStatus = pgEnum("invitation_delivery_status", [
  "not_configured",
  "queued",
  "previewed",
  "sent",
  "failed",
])

export const emailJobPriority = pgEnum("email_job_priority", [
  "critical",
  "high",
  "normal",
  "low",
])

export const emailJobStatus = pgEnum("email_job_status", [
  "queued",
  "processing",
  "previewed",
  "sent",
  "failed",
  "dead",
])

export const storageUploadPurpose = pgEnum("storage_upload_purpose", [
  "logo",
  "banner",
])

export const storageUploadStatus = pgEnum("storage_upload_status", [
  "pending",
  "uploaded",
  "completed",
  "aborted",
  "failed",
])

export const actorKind = pgEnum("actor_kind", ["platform_admin", "school_admin"])

export const platformSchoolLifecycleAction = pgEnum(
  "platform_school_lifecycle_action",
  ["suspend", "archive"],
)

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}

export const platformAdminUsers = pgTable(
  "platform_admin_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    status: platformAdminStatus("status").notNull().default("active"),
    mustChangePassword: boolean("must_change_password").notNull().default(true),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [uniqueIndex("platform_admin_users_email_key").on(table.email)],
)

export const platformAdminSessions = pgTable(
  "platform_admin_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminUserId: uuid("admin_user_id")
      .notNull()
      .references(() => platformAdminUsers.id),
    refreshTokenHash: text("refresh_token_hash").notNull(),
    tokenFamilyId: uuid("token_family_id").notNull(),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("platform_admin_sessions_refresh_hash_key").on(
      table.refreshTokenHash,
    ),
    index("platform_admin_sessions_family_idx").on(table.tokenFamilyId),
    index("platform_admin_sessions_user_idx").on(table.adminUserId),
  ],
)

export const platformAdminPasswordHistory = pgTable(
  "platform_admin_password_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminUserId: uuid("admin_user_id")
      .notNull()
      .references(() => platformAdminUsers.id),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("platform_admin_password_history_user_idx").on(table.adminUserId),
  ],
)

export const platformAdminAuditLogs = pgTable(
  "platform_admin_audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorAdminId: uuid("actor_admin_id").references(() => platformAdminUsers.id),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    beforeData: jsonb("before_data"),
    afterData: jsonb("after_data"),
    reason: text("reason"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    correlationId: text("correlation_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("platform_admin_audit_logs_created_idx").on(table.createdAt),
    index("platform_admin_audit_logs_entity_idx").on(
      table.entityType,
      table.entityId,
    ),
  ],
)

export const platformAdminLoginAttempts = pgTable(
  "platform_admin_login_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    ipAddress: text("ip_address").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("platform_admin_login_attempts_lookup_idx").on(
      table.email,
      table.ipAddress,
      table.createdAt,
    ),
  ],
)

export const tenants = pgTable(
  "tenants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantKey: text("tenant_key").notNull(),
    status: tenantStatus("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("tenants_tenant_key_key").on(table.tenantKey)],
)

export const schools = pgTable(
  "schools",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id),
    schoolCode: text("school_code").notNull(),
    name: text("name").notNull(),
    website: text("website"),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    schoolType: text("school_type").notNull(),
    board: text("board"),
    country: text("country").notNull(),
    state: text("state").notNull(),
    city: text("city").notNull(),
    postalCode: text("postal_code").notNull(),
    addressLine1: text("address_line_1").notNull(),
    addressLine2: text("address_line_2"),
    description: text("description"),
    logoStorageKey: text("logo_storage_key"),
    bannerStorageKey: text("banner_storage_key"),
    logoUpdatedAt: timestamp("logo_updated_at", { withTimezone: true }),
    bannerUpdatedAt: timestamp("banner_updated_at", { withTimezone: true }),
    timezone: text("timezone").notNull().default("Asia/Kolkata"),
    defaultLanguage: text("default_language").notNull().default("en"),
    status: schoolStatus("status").notNull().default("active"),
    provisioningStatus: provisioningStatus("provisioning_status")
      .notNull()
      .default("ready"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    archiveReason: text("archive_reason"),
    createdBy: uuid("created_by").references(() => platformAdminUsers.id),
    updatedBy: uuid("updated_by").references(() => platformAdminUsers.id),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("schools_code_key").on(table.schoolCode),
    uniqueIndex("schools_tenant_code_key").on(table.tenantId, table.schoolCode),
    index("schools_status_idx").on(table.status),
    index("schools_created_idx").on(table.createdAt),
  ],
)

export const platformAdminSchoolActionVerifications = pgTable(
  "platform_admin_school_action_verifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => platformAdminUsers.id),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id),
    action: platformSchoolLifecycleAction("action").notNull(),
    otpHash: text("otp_hash").notNull(),
    attempts: integer("attempts").notNull().default(0),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    verificationTokenHash: text("verification_token_hash"),
    verificationTokenExpiresAt: timestamp("verification_token_expires_at", {
      withTimezone: true,
    }),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("platform_admin_school_action_verifications_lookup_idx").on(
      table.adminId,
      table.schoolId,
      table.action,
      table.createdAt,
    ),
  ],
)

export const schoolCommercialTerms = pgTable(
  "school_commercial_terms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id),
    billingModel: billingModel("billing_model").notNull(),
    perStudentRate: numeric("per_student_rate", {
      precision: 12,
      scale: 2,
    }).notNull(),
    currency: text("currency").notNull().default("INR"),
    billingFrequency: billingFrequency("billing_frequency").notNull(),
    subscriptionStart: date("subscription_start").notNull(),
    subscriptionEnd: date("subscription_end").notNull(),
    studentLimit: integer("student_limit"),
    notes: text("notes"),
    status: commercialStatus("status").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("school_commercial_terms_school_key").on(table.schoolId),
  ],
)

export const schoolAdminAccounts = pgTable(
  "school_admin_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    passwordHash: text("password_hash"),
    mustChangePassword: boolean("must_change_password").notNull().default(false),
    status: schoolAdminInviteStatus("status")
      .notNull()
      .default("pending_invitation"),
    invitationDelivery: invitationDeliveryStatus("invitation_delivery")
      .notNull()
      .default("not_configured"),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("school_admin_accounts_school_email_key").on(
      table.schoolId,
      table.email,
    ),
  ],
)

export const platformIdempotencyKeys = pgTable(
  "platform_idempotency_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminUserId: uuid("admin_user_id")
      .notNull()
      .references(() => platformAdminUsers.id),
    idempotencyKey: text("idempotency_key").notNull(),
    requestHash: text("request_hash").notNull(),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("platform_idempotency_actor_key").on(
      table.adminUserId,
      table.idempotencyKey,
    ),
  ],
)

export const schoolAdminSessions = pgTable(
  "school_admin_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminAccountId: uuid("admin_account_id")
      .notNull()
      .references(() => schoolAdminAccounts.id),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id),
    refreshTokenHash: text("refresh_token_hash").notNull(),
    tokenFamilyId: uuid("token_family_id").notNull(),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("school_admin_sessions_refresh_hash_key").on(table.refreshTokenHash),
    index("school_admin_sessions_family_idx").on(table.tokenFamilyId),
    index("school_admin_sessions_user_idx").on(table.adminAccountId),
  ],
)

export const schoolAdminPasswordHistory = pgTable(
  "school_admin_password_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminAccountId: uuid("admin_account_id")
      .notNull()
      .references(() => schoolAdminAccounts.id),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("school_admin_password_history_user_idx").on(table.adminAccountId),
  ],
)

export const schoolAdminLoginAttempts = pgTable(
  "school_admin_login_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id),
    email: text("email").notNull(),
    ipAddress: text("ip_address").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("school_admin_login_attempts_lookup_idx").on(
      table.schoolId,
      table.email,
      table.ipAddress,
      table.createdAt,
    ),
  ],
)

export const schoolAdminPasswordResets = pgTable(
  "school_admin_password_resets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id),
    adminAccountId: uuid("admin_account_id")
      .notNull()
      .references(() => schoolAdminAccounts.id),
    otpHash: text("otp_hash").notNull(),
    attempts: integer("attempts").notNull().default(0),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    resetTokenHash: text("reset_token_hash"),
    resetTokenExpiresAt: timestamp("reset_token_expires_at", { withTimezone: true }),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("school_admin_password_resets_admin_idx").on(table.adminAccountId, table.createdAt),
  ],
)

export const schoolAdminAuditLogs = pgTable(
  "school_admin_audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id),
    actorAdminId: uuid("actor_admin_id").references(() => schoolAdminAccounts.id),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    beforeData: jsonb("before_data"),
    afterData: jsonb("after_data"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    correlationId: text("correlation_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("school_admin_audit_logs_school_idx").on(table.schoolId, table.createdAt),
  ],
)

export const storageUploads = pgTable(
  "storage_uploads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => schools.id),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id),
    purpose: storageUploadPurpose("purpose").notNull(),
    objectKey: text("object_key").notNull(),
    contentType: text("content_type").notNull(),
    contentLength: integer("content_length").notNull(),
    status: storageUploadStatus("status").notNull().default("pending"),
    multipartUploadId: text("multipart_upload_id"),
    actorKind: actorKind("actor_kind").notNull(),
    actorId: uuid("actor_id").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("storage_uploads_object_key").on(table.objectKey),
    index("storage_uploads_school_idx").on(table.schoolId, table.status),
  ],
)

export const emailJobs = pgTable(
  "email_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    priority: emailJobPriority("priority").notNull(),
    jobType: text("job_type").notNull(),
    status: emailJobStatus("status").notNull().default("queued"),
    idempotencyKey: text("idempotency_key").notNull(),
    schoolId: uuid("school_id").references(() => schools.id),
    recipient: text("recipient").notNull(),
    subject: text("subject").notNull(),
    payload: jsonb("payload").notNull(),
    attempts: integer("attempts").notNull().default(0),
    maxAttempts: integer("max_attempts").notNull().default(5),
    lastError: text("last_error"),
    correlationId: text("correlation_id"),
    availableAt: timestamp("available_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("email_jobs_idempotency_key").on(table.idempotencyKey),
    index("email_jobs_status_idx").on(table.status, table.priority),
  ],
)

export const emailJobAttempts = pgTable(
  "email_job_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => emailJobs.id),
    error: text("error"),
    startedAt: timestamp("started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
  },
  (table) => [index("email_job_attempts_job_idx").on(table.jobId)],
)

export const platformTables = {
  platformAdminUsers,
  platformAdminSessions,
  platformAdminPasswordHistory,
  platformAdminAuditLogs,
  platformAdminLoginAttempts,
  platformAdminSchoolActionVerifications,
  tenants,
  schools,
  schoolCommercialTerms,
  schoolAdminAccounts,
  schoolAdminSessions,
  schoolAdminPasswordHistory,
  schoolAdminLoginAttempts,
  schoolAdminPasswordResets,
  schoolAdminAuditLogs,
  storageUploads,
  emailJobs,
  emailJobAttempts,
  platformIdempotencyKeys,
}
