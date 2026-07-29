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

const placeOrder = async (accessToken: string, productId: string) => {
  await request(app)
    .post("/api/cart/items")
    .set("Authorization", authHeader(accessToken))
    .send({ productId, quantity: 2 })

  const res = await request(app)
    .post("/api/orders/checkout")
    .set("Authorization", authHeader(accessToken))
    .send(shippingAddress)

  return res.body.order
}

describe("admin order management", () => {
  it("rejects a non-admin user with 403", async () => {
    const { accessToken } = await createUser({ role: "CUSTOMER" })

    const res = await request(app)
      .get("/api/admin/orders")
      .set("Authorization", authHeader(accessToken))

    expect(res.status).toBe(403)
    expect(res.body.code).toBe("ADMIN_ACCESS_REQUIRED")
  })

  it("updates order status", async () => {
    const { accessToken: customerToken } = await createUser({ role: "CUSTOMER" })
    const { accessToken: adminToken } = await createUser({ role: "ADMIN" })
    const category = await createCategory()
    const product = await createProduct(category.id, { stockQuantity: 5 })
    const order = await placeOrder(customerToken, product.id)

    const res = await request(app)
      .patch(`/api/admin/orders/${order.id}/status`)
      .set("Authorization", authHeader(adminToken))
      .send({ status: "CONFIRMED" })

    expect(res.status).toBe(200)
    expect(res.body.status).toBe("CONFIRMED")
  })

  it("marks payment as PAID and creates a confirmed payment record", async () => {
    const { accessToken: customerToken } = await createUser({ role: "CUSTOMER" })
    const { accessToken: adminToken } = await createUser({ role: "ADMIN" })
    const category = await createCategory()
    const product = await createProduct(category.id, { stockQuantity: 5 })
    const order = await placeOrder(customerToken, product.id)

    const res = await request(app)
      .patch(`/api/admin/orders/${order.id}/payment`)
      .set("Authorization", authHeader(adminToken))
      .send({ paymentStatus: "PAID" })

    expect(res.status).toBe(200)
    expect(res.body.paymentStatus).toBe("PAID")
    expect(
      res.body.paymentRecords.some((r: any) => r.status === "CONFIRMED"),
    ).toBe(true)
  })

  it("cancels an order and restores stock", async () => {
    const { accessToken: customerToken } = await createUser({ role: "CUSTOMER" })
    const { accessToken: adminToken } = await createUser({ role: "ADMIN" })
    const category = await createCategory()
    const product = await createProduct(category.id, { stockQuantity: 5 })
    const order = await placeOrder(customerToken, product.id)

    const stockAfterCheckout = await prisma.product.findUniqueOrThrow({
      where: { id: product.id },
    })
    expect(stockAfterCheckout.stockQuantity).toBe(3)

    const cancelRes = await request(app)
      .patch(`/api/admin/orders/${order.id}/cancel`)
      .set("Authorization", authHeader(adminToken))

    expect(cancelRes.status).toBe(200)
    expect(cancelRes.body.status).toBe("CANCELLED")

    const stockAfterCancel = await prisma.product.findUniqueOrThrow({
      where: { id: product.id },
    })
    expect(stockAfterCancel.stockQuantity).toBe(5)
  })

  it("rejects cancelling an already-cancelled order", async () => {
    const { accessToken: customerToken } = await createUser({ role: "CUSTOMER" })
    const { accessToken: adminToken } = await createUser({ role: "ADMIN" })
    const category = await createCategory()
    const product = await createProduct(category.id, { stockQuantity: 5 })
    const order = await placeOrder(customerToken, product.id)

    await request(app)
      .patch(`/api/admin/orders/${order.id}/cancel`)
      .set("Authorization", authHeader(adminToken))

    const secondCancel = await request(app)
      .patch(`/api/admin/orders/${order.id}/cancel`)
      .set("Authorization", authHeader(adminToken))

    expect(secondCancel.status).toBe(400)
    expect(secondCancel.body.code).toBe("ORDER_ALREADY_CANCELLED")
  })
})
