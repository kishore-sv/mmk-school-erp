import { Router } from "express"

import { checkDatabase } from "../db"
import { createStorageProvider } from "../storage"
import { env } from "../config"

const storage = createStorageProvider(env)

export const healthRouter = Router()

healthRouter.get("/health", async (_req, res) => {
  const [postgres, storageAvailable] = await Promise.all([
    checkDatabase(),
    storage.checkAvailability(),
  ])

  const ready = postgres && storageAvailable

  res.status(ready ? 200 : 503).json({
    status: ready ? "ok" : "degraded",
    dependencies: {
      postgres: postgres ? "up" : "down",
      storage: storageAvailable ? "up" : "down",
    },
  })
})
