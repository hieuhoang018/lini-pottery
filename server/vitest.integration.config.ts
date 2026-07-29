import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/integration/**/*.test.ts"],
    // Integration tests share one real Postgres database, so files must not
    // race each other's resetDb()/TRUNCATE calls.
    fileParallelism: false,
    globals: false,
  },
})
