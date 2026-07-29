import { beforeEach, describe, expect, it, vi } from "vitest"

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: { findUnique: vi.fn() },
    $transaction: vi.fn(),
  },
}))

vi.mock("../../../src/lib/prisma", () => ({ prisma: prismaMock }))
vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}))

import bcrypt from "bcrypt"
import { loginUser, registerUser } from "../../../src/services/auth.service"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("registerUser", () => {
  it("throws a 409 AppError when the email is already taken", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "existing-user" })

    await expect(
      registerUser({ name: "A", email: "a@b.com", password: "pw" }),
    ).rejects.toMatchObject({ statusCode: 409, code: "EMAIL_ALREADY_EXISTS" })

    expect(prismaMock.$transaction).not.toHaveBeenCalled()
  })

  it("hashes the password and creates the user + cart inside a transaction", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed-pw" as never)

    const createdUser = {
      id: "u1",
      name: "A",
      email: "a@b.com",
      role: "CUSTOMER",
      phone: undefined,
      createdAt: new Date(),
    }
    const txUserCreate = vi.fn().mockResolvedValue(createdUser)
    const txCartCreate = vi.fn().mockResolvedValue({})

    prismaMock.$transaction.mockImplementation(async (cb: any) =>
      cb({ user: { create: txUserCreate }, cart: { create: txCartCreate } }),
    )

    const result = await registerUser({
      name: "A",
      email: "a@b.com",
      password: "pw",
    })

    expect(bcrypt.hash).toHaveBeenCalledWith("pw", 10)
    expect(txUserCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "a@b.com",
          passwordHash: "hashed-pw",
        }),
      }),
    )
    expect(txCartCreate).toHaveBeenCalledWith({ data: { userId: "u1" } })
    expect(result).toEqual({ user: createdUser })
  })
})

describe("loginUser", () => {
  it("throws 401 when no user matches the email", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    await expect(
      loginUser({ email: "x@y.com", password: "pw" }),
    ).rejects.toMatchObject({ statusCode: 401, code: "INVALID_CREDENTIALS" })
  })

  it("throws 401 when the password does not match", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      passwordHash: "hashed",
    })
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    await expect(
      loginUser({ email: "x@y.com", password: "wrong" }),
    ).rejects.toMatchObject({ statusCode: 401, code: "INVALID_CREDENTIALS" })
  })

  it("returns the safe user (no passwordHash) on success", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      name: "A",
      email: "a@b.com",
      role: "CUSTOMER",
      phone: null,
      createdAt: new Date(),
      passwordHash: "hashed",
    })
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    const result = await loginUser({ email: "a@b.com", password: "pw" })

    expect(result.user).toMatchObject({ id: "u1", email: "a@b.com" })
    expect(result.user).not.toHaveProperty("passwordHash")
  })
})
