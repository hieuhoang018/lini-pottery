import { afterAll, beforeEach, describe, expect, it } from "vitest"
import request from "supertest"
import app from "../../src/app"
import { prisma } from "../../src/lib/prisma"
import { resetDb } from "../helpers/db"
import { authHeader, createUser } from "../helpers/auth"
import { createCategory, createProduct } from "../helpers/factories"

beforeEach(async () => {
  await resetDb()
})

afterAll(async () => {
  await prisma.$disconnect()
})

const shippingAddress = {
  recipientName: "Jane Doe",
  phone: "0123456789",
  streetAddress: "123 Main St",
  city: "Hanoi",
  postalCode: "100000",
  country: "Vietnam",
}

describe("authenticated checkout", () => {
  it("places an order, decrements stock, and clears the cart", async () => {
    const { accessToken } = await createUser()
    const category = await createCategory()
    const product = await createProduct(category.id, { stockQuantity: 5 })

    await request(app)
      .post("/api/cart/items")
      .set("Authorization", authHeader(accessToken))
      .send({ productId: product.id, quantity: 2 })

    const checkoutRes = await request(app)
      .post("/api/orders/checkout")
      .set("Authorization", authHeader(accessToken))
      .send(shippingAddress)

    expect(checkoutRes.status).toBe(201)
    expect(checkoutRes.body.order.items).toHaveLength(1)
    expect(Number(checkoutRes.body.order.totalAmount)).toBe(200)

    const updatedProduct = await prisma.product.findUniqueOrThrow({
      where: { id: product.id },
    })
    expect(updatedProduct.stockQuantity).toBe(3)

    const cartRes = await request(app)
      .get("/api/cart")
      .set("Authorization", authHeader(accessToken))
    expect(cartRes.body.items).toEqual([])
  })

  it("rejects checkout when stock is insufficient, leaving the cart untouched", async () => {
    const { accessToken } = await createUser()
    const category = await createCategory()
    const product = await createProduct(category.id, { stockQuantity: 1 })

    await request(app)
      .post("/api/cart/items")
      .set("Authorization", authHeader(accessToken))
      .send({ productId: product.id, quantity: 1 })

    // Stock drops out from under the cart between add-to-cart and checkout.
    await prisma.product.update({
      where: { id: product.id },
      data: { stockQuantity: 0 },
    })

    const checkoutRes = await request(app)
      .post("/api/orders/checkout")
      .set("Authorization", authHeader(accessToken))
      .send(shippingAddress)

    expect(checkoutRes.status).toBe(400)
    expect(checkoutRes.body.code).toBe("NOT_ENOUGH_STOCK")

    const cartRes = await request(app)
      .get("/api/cart")
      .set("Authorization", authHeader(accessToken))
    expect(cartRes.body.items).toHaveLength(1)
  })

  it("rejects checkout with missing address fields", async () => {
    const { accessToken } = await createUser()

    const res = await request(app)
      .post("/api/orders/checkout")
      .set("Authorization", authHeader(accessToken))
      .send({})

    expect(res.status).toBe(400)
    expect(res.body.code).toBe("CHECKOUT_REQUIRED_FIELDS_MISSING")
  })
})

describe("guest checkout", () => {
  it("places a guest order without authentication", async () => {
    const category = await createCategory()
    const product = await createProduct(category.id, { stockQuantity: 5 })

    const res = await request(app)
      .post("/api/orders/guest-checkout")
      .send({
        items: [{ productId: product.id, quantity: 1 }],
        guestName: "Guest User",
        guestPhone: "0123456789",
        ...shippingAddress,
      })

    expect(res.status).toBe(201)
    expect(res.body.order.userId).toBeNull()
    expect(res.body.order.guestName).toBe("Guest User")
  })

  it("rejects a guest checkout missing required guest fields", async () => {
    const category = await createCategory()
    const product = await createProduct(category.id)

    const res = await request(app)
      .post("/api/orders/guest-checkout")
      .send({
        items: [{ productId: product.id, quantity: 1 }],
        ...shippingAddress,
      })

    expect(res.status).toBe(400)
    expect(res.body.code).toBe("GUEST_REQUIRED_FIELDS_MISSING")
  })
})
