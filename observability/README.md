# Observability stack

Self-hosted Prometheus + Grafana + Loki + Promtail for local/on-demand use. Everything here is free/self-hosted — no paid SaaS, no S3/object storage (Loki uses local filesystem storage).

Gated behind the `observability` Compose profile so it never starts on a plain `docker compose up`.

## Start it

```bash
docker compose --profile observability up
```

This brings up `prometheus`, `grafana`, `loki`, and `promtail` alongside the default `server`/`client` services (the `server` container must already be emitting metrics/logs for there to be anything to see).

## Access

| Service    | URL                     | Notes                                              |
| ---------- | ----------------------- | --------------------------------------------------- |
| Grafana    | http://localhost:3000   | user `admin`, password from `GF_SECURITY_ADMIN_PASSWORD` (root `.env`, defaults to `change-me` — local only) |
| Prometheus | http://localhost:9090   | PromQL UI, useful for debugging scrape targets/queries directly |
| Loki       | http://localhost:3100   | Direct API access, optional — normally queried through Grafana |

Prometheus and Loki datasources are auto-provisioned in Grafana on boot — no manual setup needed.

## Dashboard

A starter "Lini - RED Metrics" dashboard is auto-provisioned (`grafana/dashboards/red-metrics.json`):

- Request rate and 5xx error rate, by route
- Request latency p50/p95/p99 (`http_request_duration_seconds`)
- DB query duration p95 by model/action (`db_query_duration_seconds`)
- Event loop lag and process memory (Node's default process metrics)

## Logs

Promtail ships every container's stdout/stderr (via Docker's own log files, discovered through `docker_sd_configs`) to Loki. It does **not** parse JSON at ingest time — the `server` container's pino JSON lines land in Loki as raw text, and you filter/parse at query time in Grafana's Explore view, e.g.:

```logql
{compose_service="server"} | json | level="50"
```

(pino levels: `30`=info, `40`=warn, `50`=error.)

## Notes

- `/metrics` on the server is unauthenticated, same as `/health/db` — fine since it's only reachable inside the Docker network / local dev today. If this app is ever exposed publicly, that endpoint needs a network-level restriction (e.g. an nginx `deny all` block) first.
- Promtail reads Docker's container log files directly (bind-mounts `/var/run/docker.sock` and `/var/lib/docker/containers`, read-only) — this is the standard pattern for Docker Desktop (Mac/Windows) as well as native Linux Docker hosts.
