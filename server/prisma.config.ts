import "dotenv/config"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // `env("DATABASE_URL")` is not recognized by `prisma migrate deploy` in Prisma 7.2+
    // (https://github.com/prisma/prisma/issues/28983) — process.env works for both generate and migrate.
    url: process.env.DATABASE_URL,
  },
})
