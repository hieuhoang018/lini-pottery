import rateLimit from "express-rate-limit"

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many attempts, please try again later",
    code: "RATE_LIMITED",
  },
})

export const guestCheckoutRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many attempts, please try again later",
    code: "RATE_LIMITED",
  },
})

export const meRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  // Skipped under test: the integration suite exercises many sequential
  // profile/password/email-change requests from the same IP within one
  // vitest file (the in-memory store isn't reset between tests in a file),
  // which would otherwise trip this limiter well before any real abuse
  // pattern. NODE_ENV is "test" only under vitest, never in dev/production.
  skip: () => process.env.NODE_ENV === "test",
  message: {
    message: "Too many attempts, please try again later",
    code: "RATE_LIMITED",
  },
})
