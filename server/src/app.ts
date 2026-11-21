import cors from "cors"
import express from "express"

import { env } from "./config"
import { errorHandler } from "./middleware/error-handler"
import { requestId } from "./middleware/request-id"
import { healthRouter } from "./routes/health"
import { platformRouter } from "./features/platform/platform.routes"
import { schoolRouter } from "./features/school/school.routes"
import { isAllowedBrowserOrigin } from "./tenant/origins"

export function createApp() {
  const app = express()
  app.disable("x-powered-by")
  app.use(requestId)
  app.use(express.json({ limit: "1mb" }))

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || isAllowedBrowserOrigin(origin, env)) {
          callback(null, true)
          return
        }
        callback(null, false)
      },
      credentials: true,
    }),
  )

  app.use(healthRouter)
  app.use("/v1/platform", platformRouter)
  app.use("/v1/school", schoolRouter)

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
