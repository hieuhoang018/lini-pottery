import { sleep } from "k6"
import { Rate } from "k6/metrics"
import { loginUserPool, randomToken } from "../lib/auth.js"
import {
  browse,
  addToCart,
  viewCart,
  clearCart,
  authenticatedCheckout,
  guestCheckout,
} from "../lib/journeys.js"

// True 5xx rate — kept separate from k6's built-in http_req_failed, which
// would also count expected 429s (guest-checkout is rate-limited at
// 20 req/15min/IP, easily exceeded once ramped past a handful of VUs) and
// slow-but-successful responses as "failures".
export const serverErrorRate = new Rate("server_error_rate")

// Ramps well beyond load.js's target to find the breaking point. Latency
// thresholds are intentionally loose here — degraded latency under this
// much load is expected and informative, not a failure — but the true 5xx
// ceiling stays strict.
export const options = {
  scenarios: {
    stress: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 50 },
        { duration: "2m", target: 150 },
        { duration: "2m", target: 200 },
        { duration: "2m", target: 200 },
        { duration: "1m", target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ["p(99)<5000"],
    server_error_rate: ["rate<0.01"],
  },
}

export function setup() {
  const tokens = loginUserPool()
  return { tokens }
}

export default function (data) {
  const token = randomToken(data.tokens)
  const { products } = browse()
  const roll = Math.random()

  if (roll < 0.7) {
    // browse only — already done above
  } else if (roll < 0.93) {
    if (products.length > 0) {
      const product = products[Math.floor(Math.random() * products.length)]
      addToCart(token, product.id)
      viewCart(token)

      if (Math.random() < 0.2) {
        clearCart(token)
      }
    }
  } else if (roll < 0.965) {
    if (products.length > 0) {
      const product = products[Math.floor(Math.random() * products.length)]
      addToCart(token, product.id)
    }
    authenticatedCheckout(token, serverErrorRate)
  } else {
    guestCheckout(products, serverErrorRate)
  }

  sleep(Math.random() * 1.5)
}
