import { sleep } from "k6"
import { loginUserPool } from "../lib/auth.js"
import { browse } from "../lib/journeys.js"

// Sanity gate — run before load.js/stress.js. Confirms the core read path
// and login both work, at trivial volume.
export const options = {
  scenarios: {
    smoke: {
      executor: "shared-iterations",
      vus: 1,
      iterations: 15,
      maxDuration: "2m",
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate==0"],
  },
}

export function setup() {
  const tokens = loginUserPool()
  return { tokens }
}

export default function () {
  browse()
  sleep(1)
}
