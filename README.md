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
|-- client/                 # React/Vite frontend
|   |-- src/api/            # Axios API clients
|   |-- src/components/     # Shared and page-specific UI
|   |-- src/contexts/       # Auth and cart state
|   |-- src/pages/          # Customer and admin routes
|   `-- src/types/          # Frontend TypeScript types
|-- server/                 # Express/Prisma backend
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

## Features

- Product catalog with categories, search, pagination, product details, and image galleries
- User registration, login, logout, refresh tokens, and current-user lookup
- Authenticated cart and wishlist flows
- Guest checkout and authenticated customer checkout
- Customer order history and order detail pages
- Admin product, category, image upload, and order management
- Order, payment, and stock status handling

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
PORT=5000

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

Create `client/.env`:

```env
VITE_API_URL="http://localhost:5000/api"
```

## Installation

Install dependencies for both apps:

```bash
cd server
npm install

cd ../client
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

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Scripts

Backend scripts:

```bash
npm run dev                      # Start Express with ts-node-dev
npm run build                    # Compile TypeScript
npm start                        # Run compiled server
npm run backfill:product-search  # Backfill product search text
```

Frontend scripts:

```bash
npm run dev      # Start Vite dev server
npm run build    # Type-check and build production assets
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

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
- `/admin/orders` - Admin orders
- `/admin/orders/:id` - Admin order detail
- `/admin/products` - Admin products
- `/admin/products/new` - Create product
- `/admin/products/:id` - Admin product detail/edit
- `/admin/categories` - Admin categories

## Health check

The backend exposes:

```text
GET /
GET /health/db
```

Use `/health/db` to confirm the API can connect to PostgreSQL.
