CREATE TYPE "public"."school_billing_frequency" AS ENUM('monthly', 'quarterly', 'annual', 'custom');--> statement-breakpoint
CREATE TYPE "public"."school_billing_model" AS ENUM('per_student', 'custom');--> statement-breakpoint
CREATE TYPE "public"."school_commercial_status" AS ENUM('scheduled', 'active', 'ended');--> statement-breakpoint
CREATE TYPE "public"."invitation_delivery_status" AS ENUM('not_configured');--> statement-breakpoint
CREATE TYPE "public"."platform_admin_status" AS ENUM('active', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."school_provisioning_status" AS ENUM('ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."school_admin_invite_status" AS ENUM('pending_invitation');--> statement-breakpoint
CREATE TYPE "public"."school_status" AS ENUM('active', 'suspended', 'archived');--> statement-breakpoint
CREATE TYPE "public"."tenant_status" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TABLE "platform_admin_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_admin_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"before_data" jsonb,
	"after_data" jsonb,
	"reason" text,
	"ip_address" text,
	"user_agent" text,
	"correlation_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_admin_login_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"ip_address" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_admin_password_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_user_id" uuid NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_admin_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_user_id" uuid NOT NULL,
	"refresh_token_hash" text NOT NULL,
	"token_family_id" uuid NOT NULL,
	"user_agent" text,
	"ip_address" text,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"last_used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"status" "platform_admin_status" DEFAULT 'active' NOT NULL,
	"must_change_password" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_idempotency_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_user_id" uuid NOT NULL,
	"idempotency_key" text NOT NULL,
	"request_hash" text NOT NULL,
	"school_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "school_admin_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"school_id" uuid NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"status" "school_admin_invite_status" DEFAULT 'pending_invitation' NOT NULL,
	"invitation_delivery" "invitation_delivery_status" DEFAULT 'not_configured' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "school_commercial_terms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"school_id" uuid NOT NULL,
	"billing_model" "school_billing_model" NOT NULL,
	"per_student_rate" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"billing_frequency" "school_billing_frequency" NOT NULL,
	"subscription_start" date NOT NULL,
	"subscription_end" date NOT NULL,
	"student_limit" integer,
	"notes" text,
	"status" "school_commercial_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"school_code" text NOT NULL,
	"name" text NOT NULL,
	"website" text,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"school_type" text NOT NULL,
	"board" text,
	"country" text NOT NULL,
	"state" text NOT NULL,
	"city" text NOT NULL,
	"postal_code" text NOT NULL,
	"address_line_1" text NOT NULL,
	"address_line_2" text,
	"timezone" text DEFAULT 'Asia/Kolkata' NOT NULL,
	"default_language" text DEFAULT 'en' NOT NULL,
	"status" "school_status" DEFAULT 'active' NOT NULL,
	"provisioning_status" "school_provisioning_status" DEFAULT 'ready' NOT NULL,
	"archived_at" timestamp with time zone,
	"archive_reason" text,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_key" text NOT NULL,
	"status" "tenant_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "platform_admin_audit_logs" ADD CONSTRAINT "platform_admin_audit_logs_actor_admin_id_platform_admin_users_id_fk" FOREIGN KEY ("actor_admin_id") REFERENCES "public"."platform_admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_admin_password_history" ADD CONSTRAINT "platform_admin_password_history_admin_user_id_platform_admin_users_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."platform_admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_admin_sessions" ADD CONSTRAINT "platform_admin_sessions_admin_user_id_platform_admin_users_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."platform_admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_idempotency_keys" ADD CONSTRAINT "platform_idempotency_keys_admin_user_id_platform_admin_users_id_fk" FOREIGN KEY ("admin_user_id") REFERENCES "public"."platform_admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_idempotency_keys" ADD CONSTRAINT "platform_idempotency_keys_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_admin_accounts" ADD CONSTRAINT "school_admin_accounts_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_commercial_terms" ADD CONSTRAINT "school_commercial_terms_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schools" ADD CONSTRAINT "schools_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schools" ADD CONSTRAINT "schools_created_by_platform_admin_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."platform_admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schools" ADD CONSTRAINT "schools_updated_by_platform_admin_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."platform_admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "platform_admin_audit_logs_created_idx" ON "platform_admin_audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "platform_admin_audit_logs_entity_idx" ON "platform_admin_audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "platform_admin_login_attempts_lookup_idx" ON "platform_admin_login_attempts" USING btree ("email","ip_address","created_at");--> statement-breakpoint
CREATE INDEX "platform_admin_password_history_user_idx" ON "platform_admin_password_history" USING btree ("admin_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "platform_admin_sessions_refresh_hash_key" ON "platform_admin_sessions" USING btree ("refresh_token_hash");--> statement-breakpoint
CREATE INDEX "platform_admin_sessions_family_idx" ON "platform_admin_sessions" USING btree ("token_family_id");--> statement-breakpoint
CREATE INDEX "platform_admin_sessions_user_idx" ON "platform_admin_sessions" USING btree ("admin_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "platform_admin_users_email_key" ON "platform_admin_users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "platform_idempotency_actor_key" ON "platform_idempotency_keys" USING btree ("admin_user_id","idempotency_key");--> statement-breakpoint
CREATE UNIQUE INDEX "school_admin_accounts_school_email_key" ON "school_admin_accounts" USING btree ("school_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX "school_commercial_terms_school_key" ON "school_commercial_terms" USING btree ("school_id");--> statement-breakpoint
CREATE UNIQUE INDEX "schools_code_key" ON "schools" USING btree ("school_code");--> statement-breakpoint
CREATE UNIQUE INDEX "schools_tenant_code_key" ON "schools" USING btree ("tenant_id","school_code");--> statement-breakpoint
CREATE INDEX "schools_status_idx" ON "schools" USING btree ("status");--> statement-breakpoint
CREATE INDEX "schools_created_idx" ON "schools" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "tenants_tenant_key_key" ON "tenants" USING btree ("tenant_key");