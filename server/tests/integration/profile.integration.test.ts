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

describe("PATCH /api/users/me", () => {
  it("rejects a request without a bearer token", async () => {
    const res = await request(app).patch("/api/users/me").send({ name: "New Name" })
    expect(res.status).toBe(401)
  })

  it("updates the current user's name and phone", async () => {
    const { user, accessToken } = await createUser({ email: "profile@test.com" })

    const res = await request(app)
      .patch("/api/users/me")
      .set("Authorization", authHeader(accessToken))
      .send({ name: "Updated Name", phone: "0987654321" })

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      id: user.id,
      name: "Updated Name",
      phone: "0987654321",
    })
  })

  it("leaves phone unchanged when only name is provided", async () => {
    const { accessToken } = await createUser({ email: "profile2@test.com" })

    await request(app)
      .patch("/api/users/me")
      .set("Authorization", authHeader(accessToken))
      .send({ phone: "0000000000" })

    const res = await request(app)
      .patch("/api/users/me")
      .set("Authorization", authHeader(accessToken))
      .send({ name: "Only Name Changed" })

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      name: "Only Name Changed",
      phone: "0000000000",
    })
  })

  it("rejects an empty name with 400", async () => {
    const { accessToken } = await createUser({ email: "profile3@test.com" })

    const res = await request(app)
      .patch("/api/users/me")
      .set("Authorization", authHeader(accessToken))
      .send({ name: "   " })

    expect(res.status).toBe(400)
    expect(res.body.code).toBe("INVALID_NAME")
  })
})

describe("POST /api/users/me/password", () => {
  it("rejects a request without a bearer token", async () => {
    const res = await request(app)
      .post("/api/users/me/password")
      .send({ currentPassword: "password123", newPassword: "newpassword456" })
    expect(res.status).toBe(401)
  })

  it("rejects the wrong current password with 401", async () => {
    const { accessToken } = await createUser({ email: "pw1@test.com" })

    const res = await request(app)
      .post("/api/users/me/password")
      .set("Authorization", authHeader(accessToken))
      .send({ currentPassword: "wrong-password", newPassword: "newpassword456" })

    expect(res.status).toBe(401)
    expect(res.body.code).toBe("INVALID_CURRENT_PASSWORD")
  })

  it("rejects a new password shorter than 6 characters", async () => {
    const { accessToken } = await createUser({ email: "pw2@test.com" })

    const res = await request(app)
      .post("/api/users/me/password")
      .set("Authorization", authHeader(accessToken))
      .send({ currentPassword: "password123", newPassword: "abc" })

    expect(res.status).toBe(400)
    expect(res.body.code).toBe("PASSWORD_TOO_SHORT")
  })

  it("changes the password and allows login with the new password", async () => {
    const { user, accessToken } = await createUser({ email: "pw3@test.com" })

    const changeRes = await request(app)
      .post("/api/users/me/password")
      .set("Authorization", authHeader(accessToken))
      .send({ currentPassword: "password123", newPassword: "newpassword456" })

    expect(changeRes.status).toBe(200)

    const oldLoginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: "password123" })
    expect(oldLoginRes.status).toBe(401)

    const newLoginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: user.email, password: "newpassword456" })
    expect(newLoginRes.status).toBe(200)
  })
})

describe("POST /api/users/me/email-change", () => {
  it("rejects a request without a bearer token", async () => {
    const res = await request(app)
      .post("/api/users/me/email-change")
      .send({ newEmail: "new@test.com", currentPassword: "password123" })
    expect(res.status).toBe(401)
  })

  it("rejects the wrong current password with 401", async () => {
    const { accessToken } = await createUser({ email: "ec1@test.com" })

    const res = await request(app)
      .post("/api/users/me/email-change")
      .set("Authorization", authHeader(accessToken))
      .send({ newEmail: "new-ec1@test.com", currentPassword: "wrong-password" })

    expect(res.status).toBe(401)
    expect(res.body.code).toBe("INVALID_CURRENT_PASSWORD")
  })

  it("rejects an invalid email format with 400", async () => {
    const { accessToken } = await createUser({ email: "ec2@test.com" })

    const res = await request(app)
      .post("/api/users/me/email-change")
      .set("Authorization", authHeader(accessToken))
      .send({ newEmail: "not-an-email", currentPassword: "password123" })

    expect(res.status).toBe(400)
    expect(res.body.code).toBe("INVALID_EMAIL")
  })

  it("rejects an email already taken by another user with 409", async () => {
    await createUser({ email: "taken@test.com" })
    const { accessToken } = await createUser({ email: "ec3@test.com" })

    const res = await request(app)
      .post("/api/users/me/email-change")
      .set("Authorization", authHeader(accessToken))
      .send({ newEmail: "taken@test.com", currentPassword: "password123" })

    expect(res.status).toBe(409)
    expect(res.body.code).toBe("EMAIL_ALREADY_EXISTS")
  })

  it("sets a pending email without changing the real email yet", async () => {
    const { user, accessToken } = await createUser({ email: "ec4@test.com" })

    const res = await request(app)
      .post("/api/users/me/email-change")
      .set("Authorization", authHeader(accessToken))
      .send({ newEmail: "new-ec4@test.com", currentPassword: "password123" })

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      id: user.id,
      email: "ec4@test.com",
      pendingEmail: "new-ec4@test.com",
    })

    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", authHeader(accessToken))
    expect(meRes.body.email).toBe("ec4@test.com")
  })
})

describe("POST /api/users/me/email-change/confirm", () => {
  it("rejects a missing token with 400", async () => {
    const res = await request(app).post("/api/users/me/email-change/confirm").send({})
    expect(res.status).toBe(400)
    expect(res.body.code).toBe("TOKEN_REQUIRED")
  })

  it("rejects a garbage token with 400", async () => {
    const res = await request(app)
      .post("/api/users/me/email-change/confirm")
      .send({ token: "not-a-real-token" })
    expect(res.status).toBe(400)
    expect(res.body.code).toBe("INVALID_OR_EXPIRED_TOKEN")
  })

  it("confirms the pending email change and updates the real email", async () => {
    const { user, accessToken } = await createUser({ email: "ec5@test.com" })

    await request(app)
      .post("/api/users/me/email-change")
      .set("Authorization", authHeader(accessToken))
      .send({ newEmail: "new-ec5@test.com", currentPassword: "password123" })

    const pendingUser = await prisma.user.findUnique({ where: { id: user.id } })
    expect(pendingUser?.pendingEmailToken).toEqual(expect.any(String))

    const confirmRes = await request(app)
      .post("/api/users/me/email-change/confirm")
      .send({ token: pendingUser!.pendingEmailToken })

    expect(confirmRes.status).toBe(200)
    expect(confirmRes.body).toMatchObject({
      id: user.id,
      email: "new-ec5@test.com",
      pendingEmail: null,
    })

    const oldLoginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "ec5@test.com", password: "password123" })
    expect(oldLoginRes.status).toBe(401)

    const newLoginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "new-ec5@test.com", password: "password123" })
    expect(newLoginRes.status).toBe(200)
  })

  it("rejects reusing the same confirmation token twice", async () => {
    const { user, accessToken } = await createUser({ email: "ec6@test.com" })

    await request(app)
      .post("/api/users/me/email-change")
      .set("Authorization", authHeader(accessToken))
      .send({ newEmail: "new-ec6@test.com", currentPassword: "password123" })

    const pendingUser = await prisma.user.findUnique({ where: { id: user.id } })
    const token = pendingUser!.pendingEmailToken!

    const firstConfirm = await request(app)
      .post("/api/users/me/email-change/confirm")
      .send({ token })
    expect(firstConfirm.status).toBe(200)

    const secondConfirm = await request(app)
      .post("/api/users/me/email-change/confirm")
      .send({ token })
    expect(secondConfirm.status).toBe(400)
    expect(secondConfirm.body.code).toBe("INVALID_OR_EXPIRED_TOKEN")
  })
})
