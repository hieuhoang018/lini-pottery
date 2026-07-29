import { afterAll, beforeEach, describe, expect, it } from "vitest"
import request from "supertest"
import app from "../../src/app"
import { prisma } from "../../src/lib/prisma"
import { resetDb } from "../helpers/db"
import { authHeader, createUser } from "../helpers/auth"

beforeEach(async () => {
  await resetDb()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe("POST /api/auth/register", () => {
  it("registers a new user and returns an access token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Jane Doe",
      email: "jane@test.com",
      password: "password123",
    })

    expect(res.status).toBe(201)
    expect(res.body.user).toMatchObject({
      name: "Jane Doe",
      email: "jane@test.com",
      role: "CUSTOMER",
    })
    expect(res.body.accessToken).toEqual(expect.any(String))

    const cart = await prisma.cart.findUnique({
      where: { userId: res.body.user.id },
    })
    expect(cart).not.toBeNull()
  })

  it("rejects a duplicate email with 409", async () => {
    await createUser({ email: "dup@test.com" })

    const res = await request(app).post("/api/auth/register").send({
      name: "Someone Else",
      email: "dup@test.com",
      password: "password123",
    })

    expect(res.status).toBe(409)
    expect(res.body.code).toBe("EMAIL_ALREADY_EXISTS")
  })
})

describe("POST /api/auth/login", () => {
  it("rejects an unknown email with 401", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@test.com", password: "password123" })

    expect(res.status).toBe(401)
    expect(res.body.code).toBe("INVALID_CREDENTIALS")
  })

  it("rejects a wrong password with 401", async () => {
    const { user } = await createUser({ email: "login@test.com" })

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: "wrong-password" })

    expect(res.status).toBe(401)
    expect(res.body.code).toBe("INVALID_CREDENTIALS")
  })

  it("logs in successfully with the right credentials", async () => {
    await createUser({ email: "login-ok@test.com" })

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login-ok@test.com", password: "password123" })

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toEqual(expect.any(String))
  })
})

describe("GET /api/auth/me", () => {
  it("rejects a request without a bearer token", async () => {
    const res = await request(app).get("/api/auth/me")
    expect(res.status).toBe(401)
  })

  it("returns the current user for a valid access token", async () => {
    const { user, accessToken } = await createUser({ email: "me@test.com" })

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", authHeader(accessToken))

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ id: user.id, email: "me@test.com" })
  })
})
