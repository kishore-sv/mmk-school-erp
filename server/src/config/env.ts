import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  POSTGRES_URL: z.string().min(1),
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
