import http from "k6/http"
import { check } from "k6"
import { BASE_URL } from "./config.js"
import { authHeaders } from "./auth.js"

function safeJson(res) {
  try {
    return res.json()
  } catch {
    return null
  }
}

// Majority-weight journey: category list -> filtered product list -> one
// product detail page. Mirrors the customer-facing browse funnel.
export function browse() {
  const categoriesRes = http.get(`${BASE_URL}/api/categories`, {
    tags: { name: "browse_categories" },
  })
  check(categoriesRes, { "categories ok": (r) => r.status === 200 })

  const categories = safeJson(categoriesRes)
  const category =
    Array.isArray(categories) && categories.length > 0
      ? categories[Math.floor(Math.random() * categories.length)]
      : null

  const listUrl = category
    ? `${BASE_URL}/api/products?page=1&category=${category.slug}`
    : `${BASE_URL}/api/products?page=1`

  const productsRes = http.get(listUrl, { tags: { name: "browse_products" } })
  check(productsRes, { "products ok": (r) => r.status === 200 })

  const productsBody = safeJson(productsRes)
  const products =
    productsBody && Array.isArray(productsBody.data) ? productsBody.data : []

  if (products.length === 0) {
    return { products: [] }
  }

  const product = products[Math.floor(Math.random() * products.length)]

  const detailRes = http.get(`${BASE_URL}/api/products/slug/${product.slug}`, {
    tags: { name: "browse_product_detail" },
  })
  check(detailRes, { "product detail ok": (r) => r.status === 200 })

  return { products }
}

export function addToCart(token, productId) {
  const res = http.post(
    `${BASE_URL}/api/cart/items`,
    JSON.stringify({ productId, quantity: 1 }),
    { headers: authHeaders(token), tags: { name: "cart_add" } },
  )

  // All VUs share one pre-authenticated account (see lib/auth.js), so its
  // cart accumulates across the whole run — a repeatedly-picked product's
  // quantity can legitimately hit its stock ceiling. 400/NOT_ENOUGH_STOCK is
  // an expected business rejection here, not a server failure.
  check(res, {
    "add to cart ok or expected rejection": (r) =>
      r.status === 201 || r.status === 400,
  })

  return res
}

export function viewCart(token) {
  const res = http.get(`${BASE_URL}/api/cart`, {
    headers: authHeaders(token),
    tags: { name: "cart_view" },
  })

  check(res, { "view cart ok": (r) => r.status === 200 })

  return res
}

// Occasionally clears the shared cart so stock ceilings don't dominate
// long runs — mirrors a real user finishing/abandoning a session.
export function clearCart(token) {
  const res = http.del(`${BASE_URL}/api/cart`, null, {
    headers: authHeaders(token),
    tags: { name: "cart_clear" },
  })

  check(res, { "clear cart ok": (r) => r.status === 200 })

  return res
}

const CHECKOUT_ADDRESS = {
  recipientName: "Perf Test",
  phone: "0123456789",
  streetAddress: "123 Load Test Ave",
  city: "Testville",
  postalCode: "10000",
  country: "Vietnam",
}

// Minority-weight journey. Requires an item already in the cart — callers
// should addToCart() first, matching the real checkout precondition
// (CART_EMPTY otherwise).
export function authenticatedCheckout(token, serverErrorRate) {
  const res = http.post(
    `${BASE_URL}/api/orders/checkout`,
    JSON.stringify(CHECKOUT_ADDRESS),
    { headers: authHeaders(token), tags: { name: "checkout" } },
  )

  check(res, {
    "checkout accepted or expected rejection": (r) =>
      [201, 400, 409].includes(r.status),
  })

  serverErrorRate.add(res.status >= 500)

  return res
}

// Minority-weight journey, unauthenticated. productId must be a real UUID —
// sourced from a prior browse() call's product list, per
// order.controller.ts's guest-checkout validation. Own rate limiter
// (20 req/15min/IP, separate from the auth limiter) — expect 429s under
// sustained/stress traffic, which is by design, not a bug.
export function guestCheckout(products, serverErrorRate) {
  if (!products || products.length === 0) return null

  const product = products[Math.floor(Math.random() * products.length)]

  const payload = {
    items: [{ productId: product.id, quantity: 1 }],
    guestName: "Perf Guest",
    guestEmail: `perf-guest-${__VU}-${__ITER}@example.com`,
    guestPhone: "0123456789",
    ...CHECKOUT_ADDRESS,
  }

  const res = http.post(
    `${BASE_URL}/api/orders/guest-checkout`,
    JSON.stringify(payload),
    {
      headers: { "Content-Type": "application/json" },
      tags: { name: "guest_checkout" },
    },
  )

  check(res, {
    "guest checkout accepted, rate-limited, or expected rejection": (r) =>
      [201, 400, 409, 429].includes(r.status),
  })

  serverErrorRate.add(res.status >= 500)

  return res
}
