ALTER TYPE "public"."school_admin_invite_status" ADD VALUE IF NOT EXISTS 'active';--> statement-breakpoint
ALTER TYPE "public"."school_admin_invite_status" ADD VALUE IF NOT EXISTS 'disabled';--> statement-breakpoint
ALTER TYPE "public"."invitation_delivery_status" ADD VALUE IF NOT EXISTS 'queued';--> statement-breakpoint
ALTER TYPE "public"."invitation_delivery_status" ADD VALUE IF NOT EXISTS 'sent';--> statement-breakpoint
ALTER TYPE "public"."invitation_delivery_status" ADD VALUE IF NOT EXISTS 'failed';--> statement-breakpoint
ALTER TYPE "public"."invitation_delivery_status" ADD VALUE IF NOT EXISTS 'previewed';--> statement-breakpoint
CREATE TYPE "public"."email_job_priority" AS ENUM('critical', 'high', 'normal', 'low');--> statement-breakpoint
CREATE TYPE "public"."email_job_status" AS ENUM('queued', 'processing', 'previewed', 'sent', 'failed', 'dead');--> statement-breakpoint
CREATE TYPE "public"."storage_upload_purpose" AS ENUM('logo', 'banner');--> statement-breakpoint
CREATE TYPE "public"."storage_upload_status" AS ENUM('pending', 'uploaded', 'completed', 'aborted', 'failed');--> statement-breakpoint
CREATE TYPE "public"."actor_kind" AS ENUM('platform_admin', 'school_admin');--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "logo_storage_key" text;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "banner_storage_key" text;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "logo_updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "banner_updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "school_admin_accounts" ADD COLUMN "password_hash" text;--> statement-breakpoint
ALTER TABLE "school_admin_accounts" ADD COLUMN "must_change_password" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "school_admin_accounts" ADD COLUMN "last_login_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "school_admin_accounts" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE TABLE "school_admin_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_account_id" uuid NOT NULL,
	"school_id" uuid NOT NULL,
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
CREATE TABLE "school_admin_password_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_account_id" uuid NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "school_admin_login_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"school_id" uuid NOT NULL,
	"email" text NOT NULL,
	"ip_address" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "school_admin_password_resets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"school_id" uuid NOT NULL,
	"admin_account_id" uuid NOT NULL,
	"otp_hash" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"verified_at" timestamp with time zone,
	"reset_token_hash" text,
	"reset_token_expires_at" timestamp with time zone,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "school_admin_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"school_id" uuid NOT NULL,
	"actor_admin_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"before_data" jsonb,
	"after_data" jsonb,
	"ip_address" text,
	"user_agent" text,
	"correlation_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "storage_uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"school_id" uuid NOT NULL,
	"tenant_id" uuid NOT NULL,
	"purpose" "storage_upload_purpose" NOT NULL,
	"object_key" text NOT NULL,
	"content_type" text NOT NULL,
	"content_length" integer NOT NULL,
	"status" "storage_upload_status" DEFAULT 'pending' NOT NULL,
	"multipart_upload_id" text,
	"actor_kind" "actor_kind" NOT NULL,
	"actor_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"priority" "email_job_priority" NOT NULL,
	"job_type" text NOT NULL,
	"status" "email_job_status" DEFAULT 'queued' NOT NULL,
	"idempotency_key" text NOT NULL,
	"school_id" uuid,
	"recipient" text NOT NULL,
	"subject" text NOT NULL,
	"payload" jsonb NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 5 NOT NULL,
	"last_error" text,
	"correlation_id" text,
	"available_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_job_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"error" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "school_admin_sessions" ADD CONSTRAINT "school_admin_sessions_admin_account_id_school_admin_accounts_id_fk" FOREIGN KEY ("admin_account_id") REFERENCES "public"."school_admin_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_admin_sessions" ADD CONSTRAINT "school_admin_sessions_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_admin_password_history" ADD CONSTRAINT "school_admin_password_history_admin_account_id_school_admin_accounts_id_fk" FOREIGN KEY ("admin_account_id") REFERENCES "public"."school_admin_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_admin_login_attempts" ADD CONSTRAINT "school_admin_login_attempts_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_admin_password_resets" ADD CONSTRAINT "school_admin_password_resets_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_admin_password_resets" ADD CONSTRAINT "school_admin_password_resets_admin_account_id_school_admin_accounts_id_fk" FOREIGN KEY ("admin_account_id") REFERENCES "public"."school_admin_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_admin_audit_logs" ADD CONSTRAINT "school_admin_audit_logs_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_admin_audit_logs" ADD CONSTRAINT "school_admin_audit_logs_actor_admin_id_school_admin_accounts_id_fk" FOREIGN KEY ("actor_admin_id") REFERENCES "public"."school_admin_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_uploads" ADD CONSTRAINT "storage_uploads_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_uploads" ADD CONSTRAINT "storage_uploads_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_jobs" ADD CONSTRAINT "email_jobs_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_job_attempts" ADD CONSTRAINT "email_job_attempts_job_id_email_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."email_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "school_admin_sessions_refresh_hash_key" ON "school_admin_sessions" USING btree ("refresh_token_hash");--> statement-breakpoint
CREATE INDEX "school_admin_sessions_family_idx" ON "school_admin_sessions" USING btree ("token_family_id");--> statement-breakpoint
CREATE INDEX "school_admin_sessions_user_idx" ON "school_admin_sessions" USING btree ("admin_account_id");--> statement-breakpoint
CREATE INDEX "school_admin_password_history_user_idx" ON "school_admin_password_history" USING btree ("admin_account_id");--> statement-breakpoint
CREATE INDEX "school_admin_login_attempts_lookup_idx" ON "school_admin_login_attempts" USING btree ("school_id","email","ip_address","created_at");--> statement-breakpoint
CREATE INDEX "school_admin_password_resets_admin_idx" ON "school_admin_password_resets" USING btree ("admin_account_id","created_at");--> statement-breakpoint
CREATE INDEX "school_admin_audit_logs_school_idx" ON "school_admin_audit_logs" USING btree ("school_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "storage_uploads_object_key" ON "storage_uploads" USING btree ("object_key");--> statement-breakpoint
CREATE INDEX "storage_uploads_school_idx" ON "storage_uploads" USING btree ("school_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "email_jobs_idempotency_key" ON "email_jobs" USING btree ("idempotency_key");--> statement-breakpoint
CREATE INDEX "email_jobs_status_idx" ON "email_jobs" USING btree ("status","priority");--> statement-breakpoint
CREATE INDEX "email_job_attempts_job_idx" ON "email_job_attempts" USING btree ("job_id");
