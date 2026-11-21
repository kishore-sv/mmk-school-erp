CREATE TYPE "public"."platform_school_lifecycle_action" AS ENUM('suspend', 'archive');--> statement-breakpoint
CREATE TABLE "platform_admin_school_action_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
	"school_id" uuid NOT NULL,
	"action" "platform_school_lifecycle_action" NOT NULL,
	"otp_hash" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"verified_at" timestamp with time zone,
	"verification_token_hash" text,
	"verification_token_expires_at" timestamp with time zone,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "platform_admin_school_action_verifications" ADD CONSTRAINT "platform_admin_school_action_verifications_admin_id_platform_admin_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."platform_admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_admin_school_action_verifications" ADD CONSTRAINT "platform_admin_school_action_verifications_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "platform_admin_school_action_verifications_lookup_idx" ON "platform_admin_school_action_verifications" USING btree ("admin_id","school_id","action","created_at");