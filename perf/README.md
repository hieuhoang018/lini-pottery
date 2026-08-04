# Performance testing (k6)

Local/on-demand load testing for lini-pottery, using [k6](https://k6.io/). Not wired into CI.

## Install

```bash
brew install k6
```

## Prerequisites

- The app running via `docker compose up` (client on `:8080`, proxying `/api` to the server) or the server running directly.
- **Point at the local-db Postgres profile, never the Supabase-backed dev database.** Perf runs write real orders/cart rows and can generate significant load — see the safety note below.
- Bulk product data for realistic pagination/search: `SEED_SCALE=500 npm run seed` (see root README's seeding section).
- The seeded `customer@lini.dev` account (or whatever you set `K6_TEST_USERS` to) must exist — every scenario's `setup()` logs in with it before any traffic starts, and fails fast with a clear error if it can't.
- Optional: the observability stack (`docker compose --profile observability up`, see root README) running alongside, if you want to watch server-side behavior live during a run — see "Watching a run" below.

## Run order

Always run `smoke.js` first — it's the cheapest way to catch a broken environment (wrong `K6_BASE_URL`, missing seeded account, app not actually up) before spending minutes on `load.js`/`stress.js`:

```bash
k6 run perf/scenarios/smoke.js   # seconds — sanity gate
k6 run perf/scenarios/load.js    # ~4 min — realistic sustained traffic
k6 run perf/scenarios/stress.js  # ~8 min — ramps to the breaking point
```

If `smoke.js` fails, don't bother running the others — fix the environment first.

## Scenarios

| Scenario     | Purpose                                              | Command |
| ------------ | ----------------------------------------------------- | ------- |
| `smoke.js`   | Sanity gate — 1 VU, ~15 iterations, core read path + one login | `k6 run perf/scenarios/smoke.js` |
| `load.js`    | Sustained realistic traffic at a modest VU count, weighted browse/cart/checkout funnel, plus a dedicated rate-limit-validation pass | `k6 run perf/scenarios/load.js` |
| `stress.js`  | Ramps well past `load.js`'s target to find the breaking point | `k6 run perf/scenarios/stress.js` |

Thresholds are scoped per journey via k6 tags (`name:browse_products`, `name:cart_add`, `name:checkout`, `name:login_rapid`, ...), and the true-server-error ceiling (`server_error_rate`) is a custom metric that only counts real 5xx responses — the deliberate 429s from the rate-limit-check scenario and guest-checkout's own limiter don't count against it. See "Proving the thresholds gate works" below.

Override the target with `K6_BASE_URL` (defaults to `http://localhost:8080`, i.e. through nginx like a real user):

```bash
K6_BASE_URL=http://localhost:8080 k6 run perf/scenarios/load.js
```

## Watching a run

With the observability stack up (`docker compose --profile observability up`), open Grafana's "Lini - RED Metrics" dashboard (`http://localhost:3000`) before starting `load.js`/`stress.js`:

1. **Request rate / error rate panels** — confirm the shape matches what you expect (rate climbing with VUs, error rate near zero outside the deliberate rate-limit scenario).
2. **Request latency p50/p95/p99** — this is the main "is it degrading" signal. Under `stress.js`, expect this to climb well past `load.js`'s baseline — that's the point of the test.
3. **DB query duration (p95) by model/action** — check this *first* when latency degrades. If DB time tracks request latency closely, the database is the bottleneck, not application code — see the tuning example below.
4. **Event loop lag / process memory** — a climbing event loop lag under load points at CPU-bound work blocking the single Node event loop (not something a DB pool change fixes); climbing memory with no plateau suggests a leak, not just GC pressure.

## Tuning example

`server/src/lib/prisma.ts`'s `PrismaPg` adapter currently has no explicit connection pool size (`pg`'s default applies). If `stress.js` shows request latency and `db_query_duration_seconds` rising together, try:

```ts
const adapter = new PrismaPg({ connectionString, max: 20 })
```

then re-run `stress.js` and compare the latency/error inflection point against the previous run's `--summary-export` snapshot. Note: if `server/.env`'s `DATABASE_URL` points at Supabase, its own `max_connections` is an external ceiling on top of whatever you set here — another reason perf runs should target the local-db profile instead.

## Proving the thresholds gate works

Thresholds aren't just informational — a failed threshold makes k6 exit non-zero, which is what a CI gate (if this were ever wired in) would key off. To confirm that: temporarily set an impossible threshold, e.g. change `smoke.js`'s `http_req_duration` threshold to `["p(95)<1"]`, run it, and confirm the process exits non-zero with a failed-threshold summary — then revert.

## Results

Every run prints k6's built-in CLI summary (thresholds, checks, latency percentiles) to stdout — that's usually enough. To also keep a point-in-time snapshot, add `--summary-export` (k6 won't create the directory itself, so make sure it exists first — it's gitignored, so it won't be there on a fresh clone):

```bash
mkdir -p perf/results
k6 run --summary-export=perf/results/load-$(date +%Y%m%d-%H%M%S).json perf/scenarios/load.js
```

`perf/results/` is gitignored — these are run artifacts, not something to commit.

**Deferred (fast-follow, not built now):** piping k6 metrics to Prometheus via remote-write and importing the official k6 Grafana community dashboard, to correlate client-side latency/error data with the server-side RED dashboard (`observability/`) live during a run. Once the observability stack (see root README) is confirmed stable, this needs one additive change — `--web.enable-remote-write-receiver` on the `prometheus` service — and no changes to these scripts.

## Safety

**Never run these against the Supabase-backed `DATABASE_URL` in `server/.env`.** Point at the `docker compose --profile local-db` Postgres first (swap `server/.env`'s `DATABASE_URL` manually — this is intentionally not automated, to avoid ever scripting a credential swap).
