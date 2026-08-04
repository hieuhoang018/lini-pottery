import http from "k6/http"
import { check, sleep } from "k6"
import { Rate } from "k6/metrics"
import { BASE_URL } from "../lib/config.js"
import { loginUserPool, randomToken } from "../lib/auth.js"
import {
  browse,
  addToCart,
  viewCart,
  clearCart,
  authenticatedCheckout,
  guestCheckout,
} from "../lib/journeys.js"

// True 5xx rate — kept separate from k6's built-in http_req_failed, since
// that would also count expected 429s (guest-checkout/login rate limiting)
// as "failures".
export const serverErrorRate = new Rate("server_error_rate")

export const options = {
  scenarios: {
    // Realistic customer funnel: browse (majority) -> cart (moderate) ->
    // checkout (minority), sustained at a modest concurrent-user count.
    load: {
      executor: "ramping-vus",
      exec: "loadJourneys",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 25 },
        { duration: "3m", target: 25 },
        { duration: "30s", target: 0 },
      ],
    },
    // Deliberately drives rapid-fire logins (distinct from the funnel above)
    // to validate the auth rate limiter's 429 behavior, not to find a
    // breaking point. Runs once, shortly after setup()'s own login.
    rate_limit_check: {
      executor: "per-vu-iterations",
      exec: "rapidLogins",
      vus: 1,
      iterations: 15,
      startTime: "10s",
      maxDuration: "1m",
    },
  },
  thresholds: {
    "http_req_duration{name:browse_products}": ["p(95)<800"],
    "http_req_duration{name:cart_add}": ["p(95)<800"],
    server_error_rate: ["rate<0.01"],
  },
}

export function setup() {
  const tokens = loginUserPool()
  return { tokens }
}

export function loadJourneys(data) {
  const token = randomToken(data.tokens)
  const { products } = browse()
  const roll = Math.random()

  if (roll < 0.75) {
    // browse only — already done above
  } else if (roll < 0.95) {
    if (products.length > 0) {
      const product = products[Math.floor(Math.random() * products.length)]
      addToCart(token, product.id)
      viewCart(token)

      if (Math.random() < 0.2) {
        clearCart(token)
      }
    }
  } else if (roll < 0.975) {
    if (products.length > 0) {
      const product = products[Math.floor(Math.random() * products.length)]
      addToCart(token, product.id)
    }
    authenticatedCheckout(token, serverErrorRate)
  } else {
    guestCheckout(products, serverErrorRate)
  }

  sleep(1)
}

export function rapidLogins() {
  const res = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email: "customer@lini.dev", password: "Customer123!" }),
    {
      headers: { "Content-Type": "application/json" },
      tags: { name: "login_rapid" },
    },
  )

  check(res, {
    "login rapid returns 200 or 429": (r) => r.status === 200 || r.status === 429,
  })
}
