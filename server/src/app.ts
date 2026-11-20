import cors from "cors"
import express from "express"

import { env } from "./config"
import { errorHandler } from "./middleware/error-handler"
import { requestId } from "./middleware/request-id"
import { platformRouter } from "./features/platform/platform.routes"
import { healthRouter } from "./routes/health"

export function createApp() {
  const app = express()
  app.disable("x-powered-by")
  app.use(requestId)
  app.use(express.json({ limit: "1mb" }))

  const origins = env.CORS_ORIGINS.split(",")
    .map((origin: string) => origin.trim())
    .filter((origin: string) => origin.length > 0)

  app.use(
    cors({
      origin: origins,
      credentials: true,
    }),
  )

  app.use(healthRouter)
  app.use("/v1/platform", platformRouter)

  app.use((_req, res) => {
    res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Not found.",
      },
    })
  })

  app.use(errorHandler)
  return app
}
