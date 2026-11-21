import { RedisClient, SQL } from "bun"

import { AmazonSesEmailProvider, ConsoleEmailProvider } from "../email/provider"
import { log } from "../logger"

type Priority = "critical" | "high" | "normal" | "low"

type JobPayload = {
  id: string
  emailJobId: string
  priority: Priority
  jobType: string
  to: string
  subject: string
  text: string
  html: string
  attempt: number
  maxAttempts: number
  devOnlyOtp?: string
}

const READY_KEY = "mmk:email:ready"
const PAYLOAD_PREFIX = "mmk:email:payload:"
const DEAD_KEY = "mmk:email:dead"
const RANK: Record<Priority, number> = { critical: 1, high: 2, normal: 3, low: 4 }

function score(priority: Priority, availableAt: number): number {
  return RANK[priority] * 1e15 + availableAt
}

export async function runEmailWorker(options: {
  redisUrl: string
  postgresUrl: string
  emailProvider: "console" | "ses"
  nodeEnv: string
  concurrency: number
  stopping: () => boolean
}): Promise<void> {
  const redis = new RedisClient(options.redisUrl)
  const sql = new SQL(options.postgresUrl)
  const provider = options.emailProvider === "ses" ? new AmazonSesEmailProvider() : new ConsoleEmailProvider()

  async function once(): Promise<boolean> {
    const popped = await redis.send("ZPOPMIN", [READY_KEY])
    const values = Array.isArray(popped) ? popped : []
    if (values.length === 0) {
      return false
    }
    const id = String(values[0])
    const raw = await redis.get(PAYLOAD_PREFIX + id)
    if (!raw) {
      return true
    }
    const job = JSON.parse(raw) as JobPayload
    if (options.nodeEnv === "development" && job.devOnlyOtp) {
      log("info", "development-only password reset code", { jobId: job.id, otp: job.devOnlyOtp })
    } else if (options.nodeEnv !== "development" && job.devOnlyOtp) {
      delete job.devOnlyOtp
    }
    await sql`update email_jobs set status = 'processing', attempts = attempts + 1, updated_at = now() where id = ${job.emailJobId}::uuid`
    try {
      const result = await provider.send({ to: job.to, subject: job.subject, text: job.text, html: job.html })
      const status = result.provider === "console" ? "previewed" : result.delivered ? "sent" : "failed"
      const invitation = status === "previewed" ? "previewed" : status === "sent" ? "sent" : "failed"
      await sql`update email_jobs set status = ${status}::email_job_status, last_error = null, updated_at = now() where id = ${job.emailJobId}::uuid`
      if (job.jobType === "school.welcome") {
        await sql`update school_admin_accounts set invitation_delivery = ${invitation}::invitation_delivery_status, updated_at = now() where school_id = (select school_id from email_jobs where id = ${job.emailJobId}::uuid)`
      }
      await redis.del(PAYLOAD_PREFIX + id)
      log("info", "email job processed", { jobId: job.id, jobType: job.jobType, provider: result.provider, delivered: result.delivered, status })
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : "send failed"
      const nextAttempt = job.attempt + 1
      if (nextAttempt >= job.maxAttempts) {
        await redis.send("LPUSH", [DEAD_KEY, id])
        await sql`update email_jobs set status = 'dead', last_error = ${message.slice(0, 500)}, updated_at = now() where id = ${job.emailJobId}::uuid`
        log("error", "email job dead-lettered", { jobId: job.id })
      } else {
        const delay = Math.min(60_000, 1000 * 2 ** nextAttempt)
        job.attempt = nextAttempt
        await redis.set(PAYLOAD_PREFIX + id, JSON.stringify(job))
        await redis.send("ZADD", [READY_KEY, String(score(job.priority, Date.now() + delay)), id])
        await sql`update email_jobs set status = 'queued', last_error = ${message.slice(0, 500)}, updated_at = now() where id = ${job.emailJobId}::uuid`
        log("warn", "email job retry scheduled", { jobId: job.id, attempt: nextAttempt })
      }
      return true
    }
  }

  const loops = Array.from({ length: options.concurrency }, async () => {
    while (!options.stopping()) {
      const worked = await once().catch((error: unknown) => {
        log("error", "email worker iteration failed", { error: error instanceof Error ? error.name : "unknown" })
        return false
      })
      if (!worked) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }
  })
  await Promise.all(loops)
  redis.close()
}
