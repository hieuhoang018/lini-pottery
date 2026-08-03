import { Registry, Histogram, Counter, collectDefaultMetrics } from "prom-client"

export const register = new Registry()

collectDefaultMetrics({ register })

export const httpRequestDurationSeconds = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"] as const,
  registers: [register],
})

export const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"] as const,
  registers: [register],
})

export const dbQueryDurationSeconds = new Histogram({
  name: "db_query_duration_seconds",
  help: "Duration of Prisma database queries in seconds",
  labelNames: ["model", "action"] as const,
  registers: [register],
})
