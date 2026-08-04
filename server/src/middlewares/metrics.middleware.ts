import { Request, Response, NextFunction } from "express"
import { httpRequestDurationSeconds, httpRequestsTotal } from "../lib/metrics"

// Express resets req.baseUrl/req.params once an error bubbles past a mounted
// sub-router on its way to the centralized error middleware (this app throws
// AppError pervasively, so that's most non-2xx responses) — by the time
// res.on("finish") fires, req.baseUrl is back to "". req.originalUrl and
// req.route.path both survive that unwind, so rebuild the mount prefix by
// matching route.path's pattern against the tail of originalUrl instead of
// trusting req.baseUrl.
function routePathToRegex(routePath: string): RegExp {
  const pattern = routePath
    .split("/")
    .map((segment) =>
      segment.startsWith(":")
        ? "[^/]+"
        : segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    )
    .join("/")

  return new RegExp(`${pattern}$`)
}

function resolveRouteLabel(req: Request): string {
  if (!req.route) return "unmatched"

  const routePath: string = req.route.path
  const originalPath = req.originalUrl.split("?")[0]

  // Root-mounted routes (router.get("/", ...)) match the mount prefix itself
  // with no trailing slash in the actual request, so the suffix regex below
  // (which requires "/" to be present) can't match — handle separately.
  if (routePath === "/") {
    const base = originalPath.endsWith("/") ? originalPath.slice(0, -1) : originalPath
    return `${base}/`
  }

  const match = originalPath.match(routePathToRegex(routePath))
  const baseUrl = match ? originalPath.slice(0, match.index) : ""

  return `${baseUrl}${routePath}`
}

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint()

  res.on("finish", () => {
    const labels = {
      method: req.method,
      route: resolveRouteLabel(req),
      status_code: String(res.statusCode),
    }

    const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9

    httpRequestDurationSeconds.observe(labels, durationSeconds)
    httpRequestsTotal.inc(labels)
  })

  next()
}
