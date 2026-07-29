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

const setupUserAndProduct = async (productOverrides = {}) => {
  const { accessToken } = await createUser()
  const category = await createCategory()
  const product = await createProduct(category.id, productOverrides)
  return { accessToken, product }
}

describe("cart flow", () => {
  it("starts empty for a new user", async () => {
    const { accessToken } = await createUser()

    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", authHeader(accessToken))

    expect(res.status).toBe(200)
    expect(res.body.items).toEqual([])
  })

  it("adds an item, reflects it in the cart, updates quantity, then removes it", async () => {
    const { accessToken, product } = await setupUserAndProduct({ stockQuantity: 5 })

    const addRes = await request(app)
      .post("/api/cart/items")
      .set("Authorization", authHeader(accessToken))
      .send({ productId: product.id, quantity: 2 })

    expect(addRes.status).toBe(201)
    expect(addRes.body.quantity).toBe(2)

    const getRes = await request(app)
      .get("/api/cart")
      .set("Authorization", authHeader(accessToken))

    expect(getRes.body.items).toHaveLength(1)
    expect(getRes.body.items[0].productId).toBe(product.id)

    const itemId = addRes.body.id

    const updateRes = await request(app)
      .patch(`/api/cart/items/${itemId}`)
      .set("Authorization", authHeader(accessToken))
      .send({ quantity: 4 })

    expect(updateRes.status).toBe(200)
    expect(updateRes.body.quantity).toBe(4)

    const removeRes = await request(app)
      .delete(`/api/cart/items/${itemId}`)
      .set("Authorization", authHeader(accessToken))

    expect(removeRes.status).toBe(200)

    const finalCart = await request(app)
      .get("/api/cart")
      .set("Authorization", authHeader(accessToken))

    expect(finalCart.body.items).toEqual([])
  })

  it("rejects adding a quantity that exceeds stock", async () => {
    const { accessToken, product } = await setupUserAndProduct({ stockQuantity: 2 })

    const res = await request(app)
      .post("/api/cart/items")
      .set("Authorization", authHeader(accessToken))
      .send({ productId: product.id, quantity: 5 })

    expect(res.status).toBe(400)
    expect(res.body.code).toBe("NOT_ENOUGH_STOCK")
  })
})
