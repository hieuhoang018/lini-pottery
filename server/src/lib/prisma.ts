import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { dbQueryDurationSeconds } from "./metrics"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not set")
}

const adapter = new PrismaPg({ connectionString })

function buildPrismaClient() {
  return new PrismaClient({
    adapter,
    log: ["warn", "error"],
  }).$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const start = process.hrtime.bigint()
          try {
            return await query(args)
          } finally {
            const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9
            dbQueryDurationSeconds.observe(
              { model: model ?? "raw", action: operation },
              durationSeconds,
            )
          }
        },
      },
    },
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof buildPrismaClient>
}

export const prisma = globalForPrisma.prisma ?? buildPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export type PrismaTransactionClient = Parameters<
  Parameters<typeof prisma.$transaction>[0]
>[0]
