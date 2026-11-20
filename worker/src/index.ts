import { RedisClient } from "bun"

import { loadEnv } from "./config/env"
import { log } from "./logger"

const env = loadEnv()
const redis = new RedisClient(env.REDIS_URL)

let stopping = false

async function shutdown(signal: string) {
  if (stopping) {
    return
  }
  stopping = true
  log("info", "worker shutting down", { signal })
  redis.close()
  process.exit(0)
}

process.on("SIGINT", () => {
  void shutdown("SIGINT")
})

process.on("SIGTERM", () => {
  void shutdown("SIGTERM")
})

const pong = await redis.ping()

if (pong !== "PONG") {
  log("error", "redis ping failed")
  redis.close()
  process.exit(1)
}

log("info", "worker ready", { redis: "up" })

// No jobs are registered.
// BullMQ 5.77+ documents Bun support through createBunRedisClient(new RedisClient(url)).
// A queue library is intentionally not installed until a job is approved.
await new Promise<void>(() => {
  return undefined
})
