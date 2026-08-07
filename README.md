# Lini

Lini is a full-stack ecommerce application for browsing products, managing a cart and wishlist, placing orders, and administering products, categories, uploads, and order status.

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL
- Auth: JWT access tokens plus refresh-token cookies
- Uploads: Multer and Cloudinary

## Project structure

```text
.
|-- client/                 # React/Vite storefront frontend
|   |-- src/api/            # Axios API clients
|   |-- src/components/     # Shared and page-specific UI
|   |-- src/contexts/       # Auth and cart state
|   |-- src/pages/          # Customer-facing routes
|   `-- src/types/          # Frontend TypeScript types
|-- admin/                  # React/Vite admin frontend (separate app, deployed independently)
|   |-- src/api/            # Axios API clients
|   |-- src/components/     # Shared and page-specific admin UI
|   |-- src/contexts/       # Auth state
|   |-- src/pages/          # Admin routes (dashboard, orders, products, categories)
|   `-- src/types/          # Frontend TypeScript types
|-- server/                 # Express/Prisma backend (shared by both frontends)
|   |-- prisma/             # Prisma schema and migrations
|   `-- src/
|       |-- controllers/    # Request handlers
|       |-- middlewares/    # Auth, errors, uploads
|       |-- routes/         # API route definitions
|       |-- services/       # Business logic
|       |-- types/          # Backend TypeScript types
|       `-- utils/          # Shared backend helpers
`-- diagram/                # Project diagrams/assets
```

`client/` and `admin/` are independent npm projects (their own `package.json`/lockfile) that both call the same `server/` API. Nothing is shared between them at the build/tooling level — common pieces (auth handling, API client, a few hooks/UI atoms) are intentionally duplicated in each app rather than extracted into a shared package.

## Features

- Product catalog with categories, search, pagination, product details, and image galleries
- User registration, login, logout, refresh tokens, and current-user lookup
- Authenticated cart and wishlist flows
- Guest checkout and authenticated customer checkout
- Customer order history and order detail pages
- Admin product, category, image upload, and order management
- Order, payment, and stock status handling
- Admin new-order alerts via a Telegram bot

## Prerequisites

- Node.js
- npm
- PostgreSQL database
- Cloudinary account for product image uploads

## Environment variables

Create `server/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_ACCESS_SECRET="replace-with-a-long-random-secret"
JWT_REFRESH_SECRET="replace-with-a-different-long-random-secret"
CLIENT_URL="http://localhost:5173"
# Comma-separated list of allowed CORS origins. Include both frontends' dev
# ports locally (client defaults to 5173, admin to 5174); in production,
# include both apps' deployed domains.
CLIENT_URLS="http://localhost:5173,http://localhost:5174"
# Set to "none" (with HTTPS) if a deployed frontend calls the API from a
# different origin, e.g. the admin app deployed on Vercel — see "Deploying
# the admin app" below. Defaults to "strict", which is fine when frontend
# and API share a reverse proxy / origin.
COOKIE_SAME_SITE="strict"
PORT=5000

# Optional: pino log level (trace|debug|info|warn|error|fatal). Defaults to
# "debug" in dev, "info" when NODE_ENV=production.
LOG_LEVEL="debug"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Optional: admin new-order alerts via a Telegram bot (no domain needed).
# Unset in dev/CI is fine — the alert is skipped with a console warning, nothing breaks.
# Create a bot with @BotFather, message it once, then read your chat id from
# https://api.telegram.org/bot<token>/getUpdates
TELEGRAM_BOT_TOKEN="123456789:your-bot-token"
TELEGRAM_ADMIN_CHAT_ID="your-chat-id"

# Optional: transactional email (account email-change verification, and future
# order notifications) via Resend. Unset in dev/CI is fine — emails are skipped
# with a warning, nothing breaks. Resend's sandbox key + the onboarding@resend.dev
# sender work without domain verification, BUT until you verify a sending
# domain, Resend only delivers to the email address on your own Resend
# account — sends to any other address are silently accepted by our code
# (mailer.ts logs the API error, doesn't throw) but never arrive. To manually
# test the email-change flow end-to-end, either verify a domain in Resend or
# use your Resend account's own email as the "new email" during testing.
#
# KNOWN LIMITATION (as of this writing, no domain owned yet): this means the
# email-change feature is dev/self-test only right now — in production it
# would only ever reach the Resend account owner's inbox, not real customers.
# Buy + verify a domain in Resend (or switch to a provider with single-sender
# verification, e.g. SendGrid) before relying on this for real users.
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="no-reply@yourdomain.com"
```

Create `client/.env`:

```env
VITE_API_URL="http://localhost:5000/api"
```

Create `admin/.env`:

```env
VITE_API_URL="http://localhost:5000/api"
```

## Installation

Install dependencies for all three apps:

```bash
cd server
npm install

cd ../client
npm install

cd ../admin
npm install
```

## Database setup

From the `server` directory, run the Prisma migrations:

```bash
npx prisma migrate dev
```

Optional Prisma commands:

```bash
npx prisma studio
npx prisma generate
npm run backfill:product-search
```

## Running locally

Start the API server:

```bash
cd server
npm run dev
```

The backend runs on `http://localhost:5000` by default.

Start the storefront in another terminal:

```bash
cd client
npm run dev
```

The storefront runs on `http://localhost:5173` by default.

Start the admin app in a third terminal:

```bash
cd admin
npm run dev
```

The admin app runs on `http://localhost:5174` by default (Vite auto-increments past 5173 if the storefront is already running; confirm the port `vite` prints, and make sure it's included in the server's `CLIENT_URLS`).

## Scripts

Backend scripts:

```bash
npm run dev                      # Start Express with ts-node-dev
npm run build                    # Compile TypeScript
npm start                        # Run compiled server
npm run backfill:product-search  # Backfill product search text
npm run lint                     # Run ESLint
npm run typecheck                # Type-check without emitting
npm run test:unit                # Run unit tests (Prisma mocked, no DB needed)
npm run test:integration         # Run integration tests against a real Postgres
```

Frontend scripts:

```bash
npm run dev      # Start Vite dev server
npm run build    # Type-check and build production assets
npm run lint     # Run ESLint
npm run preview  # Preview production build
npm test         # Run component/context tests (Vitest + Testing Library)
```

## Testing

Backend unit tests (`server/tests/unit`) mock Prisma and need no database. Integration tests (`server/tests/integration`) run real requests against the Express app with `supertest`, against a real Postgres. They read connection/JWT config from `server/.env.test` (dummy secrets, safe to commit).

To run integration tests locally, start a disposable test database and apply migrations, then run the suite:

```bash
docker run -d --name lini-test-db \
  -e POSTGRES_USER=lini -e POSTGRES_PASSWORD=lini -e POSTGRES_DB=lini_test \
  -p 5432:5432 postgres:16-alpine

cd server
npx prisma generate   # first time only, or after pulling schema changes
npx prisma migrate deploy
npm run test:integration
```

This is a separate, disposable database from the optional `docker compose --profile local-db` Postgres used for local app development — don't point tests at your dev database, since integration tests truncate all tables between runs.

Frontend tests live alongside the code they cover (e.g. `client/src/contexts/*.test.tsx`) and run with `npm test`.

## Docker

Run the whole app (client + admin + server) with Docker Compose. This still uses `server/.env`, `client/.env`, and `admin/.env` for app config (e.g. a Supabase `DATABASE_URL`), plus a root `.env` for Compose/build-time-only values:

```bash
cp .env.example .env
```

Build and start:

```bash
docker compose up --build
```

- Storefront: `http://localhost:8080` (served by Nginx; proxies `/api` to the server container)
- Admin: `http://localhost:8081` (same setup — its own Nginx container proxying `/api` to the server container)
- Backend: `http://localhost:5050` (published as 5050 to avoid the common macOS AirPlay Receiver conflict on port 5000; the container listens on 5000 internally)

The server container runs `prisma migrate deploy` automatically on startup before starting the app.

### Optional local Postgres

A Postgres service is included but not started by default, since the app currently points at Supabase. To spin it up for future local/offline use:

```bash
docker compose --profile local-db up --build
```

Then point `DATABASE_URL` in `server/.env` at it, e.g.:

```env
DATABASE_URL="postgresql://lini:change-me@postgres:5432/lini"
```

### Seeding test data

The local Postgres starts empty. `server/src/scripts/seedDb.ts` populates it with 4 categories, 20 products, one admin, and one customer account — useful for testing admin flows the UI itself has no path to (there's no admin sign-up form). The seed is idempotent (upserts keyed on slug/email), so running it repeatedly is safe.

To seed once, on demand:

```bash
docker compose exec server node dist/scripts/seedDb.js
```

To seed automatically on every `docker compose up`, set `SEED_DB=true` in the root `.env` before starting the stack. It's read by the server container's entrypoint, runs after migrations and before the app starts, and defaults to `false` so it never fires against a real (e.g. Supabase-backed) database by accident.

Seeded accounts:

| Role     | Email               | Password      |
| -------- | -------------------- | ------------- |
| Admin    | `admin@lini.dev`    | `Admin123!`   |
| Customer | `customer@lini.dev` | `Customer123!` |

Outside Docker (local dev against any Postgres your `server/.env` points at), run `cd server && npm run seed` instead.

To generate bulk data for perf/load testing, set `SEED_SCALE` to the number of extra products to generate, e.g. `SEED_SCALE=500 npm run seed` (or as a `docker compose exec` env var). These land alongside the 20 hand-authored products with deterministic `perf-product-{n}` slugs, round-robin across the 4 real categories — unset or `0` leaves the base seed exactly as-is.

### Observability (optional)

A self-hosted Prometheus + Grafana + Loki + Promtail stack is included but not started by default:

```bash
docker compose --profile observability up --build
```

See [`observability/README.md`](observability/README.md) for URLs, credentials, and what's on the starter dashboard.

## Deploying the admin app

`admin/` can run either self-hosted via the Docker Compose stack above, or as its own Vercel project — same two options `client/` supports.

### Vercel (current production setup)

This deploys the same way `client/` does today: as its own Vercel project pointed at the `admin` directory (Vercel auto-detects the Vite build), independent of the Docker Compose stack above.

1. Create a new Vercel project from this repo with **Root Directory** set to `admin`.
2. Set the `VITE_API_URL` environment variable on that project to the deployed API's full URL (e.g. `https://api.yourdomain.com/api`) — not a relative path, since there's no reverse proxy in front of it.
3. Add the admin project's domain(s) to `CLIENT_URLS` in the server's production environment, alongside the storefront's existing entry.
4. Confirm `COOKIE_SAME_SITE` and `secure` are set correctly for cross-origin cookies in production (see the `Environment variables` section above) — this is already required for the storefront's Vercel deployment today, so admin rides the same configuration.

## API overview

Base API path: `/api`

### Auth

- `POST /auth/register` - Register a user
- `POST /auth/login` - Log in
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Log out
- `GET /auth/me` - Get the authenticated user

### Categories

- `GET /categories` - List categories
- `GET /categories/:slug` - Get a category by slug
- `POST /categories` - Create a category as admin
- `PATCH /categories/:id` - Update a category as admin
- `DELETE /categories/:id` - Delete a category as admin

### Products

- `GET /products` - List products
- `GET /products/slug/:slug` - Get a product by slug
- `GET /products/id/:id` - Get a product by id as admin
- `POST /products` - Create a product as admin
- `PATCH /products/:id` - Update a product as admin
- `PATCH /products/:id/stock` - Update product stock as admin
- `PATCH /products/:id/active` - Update product active status as admin

### Product images

- `GET /products/:productId/images` - List product images
- `POST /products/:productId/images` - Add a product image as admin
- `DELETE /product-images/:id` - Delete a product image as admin

### Uploads

- `POST /uploads/product-image` - Upload a product image as admin
- `DELETE /uploads/image` - Delete an uploaded image as admin

### Cart

- `GET /cart` - Get the authenticated user's cart
- `POST /cart/items` - Add an item to the cart
- `PATCH /cart/items/:itemId` - Update a cart item
- `DELETE /cart/items/:itemId` - Remove a cart item
- `DELETE /cart` - Clear the cart

### Wishlist

- `GET /wishlist` - Get the authenticated user's wishlist
- `POST /wishlist/items` - Add a wishlist item
- `DELETE /wishlist/items/:productId` - Remove a wishlist item

### Orders

- `POST /orders/guest-checkout` - Place an order as a guest
- `POST /orders/checkout` - Place an order as an authenticated user
- `GET /orders/my` - List the authenticated user's orders
- `GET /orders/:id` - Get one of the authenticated user's orders

### Admin orders

- `GET /admin/orders` - List orders as admin
- `GET /admin/orders/:id` - Get an order as admin
- `PATCH /admin/orders/:id/status` - Update order status as admin
- `PATCH /admin/orders/:id/payment` - Update payment status as admin
- `PATCH /admin/orders/:id/cancel` - Cancel an order as admin

### Admin products

- `GET /admin/products` - List products for admin views

## Frontend routes

### Storefront (`client/`)

- `/` - Home
- `/shop` - Product catalog
- `/products/:slug` - Product detail
- `/cart` - Cart
- `/login` - Login
- `/register` - Register
- `/checkout` - Checkout
- `/order-success` - Checkout success
- `/wishlist` - Protected wishlist
- `/orders` - Protected customer orders
- `/orders/:id` - Protected customer order detail

### Admin (`admin/`, separate app)

- `/login` - Admin login
- `/` - Dashboard
- `/orders` - Admin orders
- `/orders/:id` - Admin order detail
- `/products` - Admin products
- `/products/new` - Create product
- `/products/:id` - Admin product detail/edit
- `/categories` - Admin categories

## Health check

The backend exposes:

```text
GET /
GET /health/db
```

Use `/health/db` to confirm the API can connect to PostgreSQL.
