import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  REDIS_URL: z.string().min(1),
  POSTGRES_URL: z.string().min(1),
  EMAIL_PROVIDER: z.enum(["console", "ses"]).default("console"),
  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(2),
})

export type Env = z.infer<typeof envSchema>

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = envSchema.safeParse(source)
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")
    throw new Error(`Invalid worker environment: ${details}`)
  }
  return parsed.data
}
