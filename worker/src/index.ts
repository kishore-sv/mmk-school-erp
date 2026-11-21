import { RedisClient } from "bun"

import { loadEnv } from "./config/env"
import { log } from "./logger"
import { runEmailWorker } from "./queue/email-worker"

const env = loadEnv()
const redis = new RedisClient(env.REDIS_URL)
let stopping = false

async function shutdown(signal: string) {
  if (stopping) {
    return
  }
  stopping = true
  log("info", "worker shutting down", { signal })
}

process.on("SIGINT", () => {
  void shutdown("SIGINT")
})
process.on("SIGTERM", () => {
  void shutdown("SIGTERM")
})

const pong = await redis.ping()
redis.close()
if (pong !== "PONG") {
  log("error", "redis ping failed")
  process.exit(1)
}

log("info", "worker ready", { redis: "up", email: env.EMAIL_PROVIDER })

await runEmailWorker({
  redisUrl: env.REDIS_URL,
  postgresUrl: env.POSTGRES_URL,
  emailProvider: env.EMAIL_PROVIDER,
  nodeEnv: env.NODE_ENV,
  concurrency: env.WORKER_CONCURRENCY,
  stopping: () => stopping,
})

log("info", "worker stopped")
process.exit(0)
