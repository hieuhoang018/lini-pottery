import "dotenv/config"
import app from "./app"
import { logger } from "./lib/logger"
import { prisma } from "./lib/prisma"

const PORT = process.env.PORT || 5000
const SHUTDOWN_TIMEOUT_MS = 10_000

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

const shutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`)

  const forceExitTimer = setTimeout(() => {
    logger.error("Graceful shutdown timed out, forcing exit")
    process.exit(1)
  }, SHUTDOWN_TIMEOUT_MS)

  server.close(async (err) => {
    clearTimeout(forceExitTimer)

    if (err) {
      logger.error({ err }, "Error while closing server")
      process.exit(1)
    }

    await prisma.$disconnect()
    logger.info("Shutdown complete")
    process.exit(0)
  })
}

process.on("SIGTERM", () => shutdown("SIGTERM"))
process.on("SIGINT", () => shutdown("SIGINT"))
