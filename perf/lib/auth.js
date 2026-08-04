import http from "k6/http"
import { check } from "k6"
import { BASE_URL } from "./config.js"

// Comma-separated "email:password" pairs, e.g. "a@x.com:pw1,b@x.com:pw2".
// Defaults to the single customer account seeded by server/src/scripts/seedDb.ts.
// Logged in once per user in setup() — well under the auth rate limiter's
// 10-req/15-min-per-IP budget — and the resulting tokens are reused across
// every VU/iteration for the rest of the run, since per-VU login would blow
// through that limit almost immediately.
const TEST_USERS = (__ENV.K6_TEST_USERS || "customer@lini.dev:Customer123!")
  .split(",")
  .map((pair) => {
    const [email, password] = pair.split(":")
    return { email, password }
  })

export function loginUserPool() {
  const tokens = []

  for (const user of TEST_USERS) {
    const res = http.post(
      `${BASE_URL}/api/auth/login`,
      JSON.stringify({ email: user.email, password: user.password }),
      {
        headers: { "Content-Type": "application/json" },
        tags: { name: "login_setup" },
      },
    )

    const ok = check(res, {
      "setup login succeeded": (r) => r.status === 200,
    })

    if (ok) {
      tokens.push(res.json("accessToken"))
    }
  }

  if (tokens.length === 0) {
    throw new Error(
      "perf setup: no users could be logged in — check K6_TEST_USERS and that the seeded accounts exist",
    )
  }

  return tokens
}

export function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

export function randomToken(tokens) {
  return tokens[Math.floor(Math.random() * tokens.length)]
}
