import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  POSTGRES_URL: z.string().min(1),
  REDIS_URL: z.string().min(1).default("redis://127.0.0.1:6379"),
  CORS_ORIGINS: z.string().default(""),
  STORAGE_PROVIDER: z.enum(["minio", "s3", "r2", "supabase"]),
  STORAGE_ENDPOINT: z.string().default(""),
  STORAGE_REGION: z.string().min(1).default("us-east-1"),
  STORAGE_BUCKET: z.string().min(1),
  STORAGE_ACCESS_KEY_ID: z.string().min(1),
  STORAGE_SECRET_ACCESS_KEY: z.string().min(1),
  STORAGE_FORCE_PATH_STYLE: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
  STORAGE_PUBLIC_URL: z.string().default(""),
  PLATFORM_ACCESS_TOKEN_SECRET: z.string().min(32),
  SCHOOL_ACCESS_TOKEN_SECRET: z.string().min(32),
  SCHOOL_ADMIN_LOCAL_BASE_DOMAIN: z.string().min(1).default("localhost"),
  SCHOOL_PORTAL_LOCAL_BASE_DOMAIN: z.string().min(1).default("localhost"),
  SCHOOL_ADMIN_PRODUCTION_BASE_DOMAIN: z.string().min(1).default("admin.mmkerp.tech"),
  SCHOOL_PORTAL_PRODUCTION_BASE_DOMAIN: z.string().min(1).default("mmkerp.tech"),
  SCHOOL_ADMIN_LOCAL_PORT: z.coerce.number().int().positive().default(3001),
  SCHOOL_PORTAL_LOCAL_PORT: z.coerce.number().int().positive().default(3002),
  OTP_TTL_SECONDS: z.coerce.number().int().positive().default(300),
  OTP_MAX_ATTEMPTS: z.coerce.number().int().positive().default(5),
  OTP_RESEND_COOLDOWN_SECONDS: z.coerce.number().int().positive().default(60),
  EMAIL_PROVIDER: z.enum(["console", "ses"]).default("console"),
  EMAIL_FROM: z.string().min(3).default("MMK School ERP <noreply@mmkerp.tech>"),
  EMAIL_REPLY_TO: z.string().default(""),
  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(2),
  SUPPORT_EMAIL: z.string().default("support@mmkerp.tech"),
})

export type Env = z.infer<typeof envSchema>
export type StorageProviderName = Env["STORAGE_PROVIDER"]

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = envSchema.safeParse(source)
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ")
    throw new Error(`Invalid server environment: ${details}`)
  }
  return parsed.data
}
