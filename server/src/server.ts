import { createApp } from "./app"
import { env } from "./config"
import { log } from "./utils/logger"

const app = createApp()

const server = app.listen(env.PORT, "127.0.0.1", () => {
  log("info", "server listening", { port: env.PORT })
})

function shutdown(signal: string) {
  log("info", "server shutting down", { signal })
  server.close(() => {
    process.exit(0)
  })
}

process.on("SIGINT", () => {
  shutdown("SIGINT")
})

process.on("SIGTERM", () => {
  shutdown("SIGTERM")
})
