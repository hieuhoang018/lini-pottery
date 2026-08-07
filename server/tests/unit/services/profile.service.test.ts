import { beforeEach, describe, expect, it, vi } from "vitest"

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: { findUnique: vi.fn(), update: vi.fn() },
  },
}))

vi.mock("../../../src/lib/prisma", () => ({ prisma: prismaMock }))
vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}))
vi.mock("../../../src/lib/mailer", () => ({ sendMail: vi.fn() }))
vi.mock("../../../src/utils/token", () => ({
  signEmailChangeToken: vi.fn(),
  verifyEmailChangeToken: vi.fn(),
}))

import bcrypt from "bcrypt"
import { sendMail } from "../../../src/lib/mailer"
import { signEmailChangeToken, verifyEmailChangeToken } from "../../../src/utils/token"
import {
  changePassword,
  confirmEmailChange,
  requestEmailChange,
  updateProfile,
} from "../../../src/services/profile.service"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("updateProfile", () => {
  it("throws a 404 AppError when the user does not exist", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    await expect(
      updateProfile("missing-user", { name: "New Name" }),
    ).rejects.toMatchObject({ statusCode: 404, code: "USER_NOT_FOUND" })

    expect(prismaMock.user.update).not.toHaveBeenCalled()
  })

  it("falls back to existing values for fields not provided", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      name: "Old Name",
      phone: "0123456789",
    })
    prismaMock.user.update.mockResolvedValue({
      id: "u1",
      name: "Old Name",
      phone: "0123456789",
    })

    await updateProfile("u1", {})

    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { name: "Old Name", phone: "0123456789" },
      }),
    )
  })

  it("updates only the provided fields", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      name: "Old Name",
      phone: "0123456789",
    })
    prismaMock.user.update.mockResolvedValue({
      id: "u1",
      name: "New Name",
      phone: "0123456789",
    })

    const result = await updateProfile("u1", { name: "New Name" })

    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "u1" },
        data: { name: "New Name", phone: "0123456789" },
      }),
    )
    expect(result).toEqual({ id: "u1", name: "New Name", phone: "0123456789" })
  })
})

describe("changePassword", () => {
  it("throws a 404 AppError when the user does not exist", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    await expect(
      changePassword("missing-user", { currentPassword: "old", newPassword: "newpass1" }),
    ).rejects.toMatchObject({ statusCode: 404, code: "USER_NOT_FOUND" })
  })

  it("throws a 401 AppError when the current password is wrong", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "u1", passwordHash: "hashed" })
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    await expect(
      changePassword("u1", { currentPassword: "wrong", newPassword: "newpass1" }),
    ).rejects.toMatchObject({ statusCode: 401, code: "INVALID_CURRENT_PASSWORD" })

    expect(prismaMock.user.update).not.toHaveBeenCalled()
  })

  it("hashes and stores the new password when the current password is correct", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "u1", passwordHash: "hashed-old" })
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed-new" as never)

    await changePassword("u1", { currentPassword: "old", newPassword: "newpass1" })

    expect(bcrypt.hash).toHaveBeenCalledWith("newpass1", 10)
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { passwordHash: "hashed-new" },
    })
  })
})

describe("requestEmailChange", () => {
  it("throws a 404 AppError when the user does not exist", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    await expect(
      requestEmailChange("missing-user", {
        newEmail: "new@test.com",
        currentPassword: "old",
      }),
    ).rejects.toMatchObject({ statusCode: 404, code: "USER_NOT_FOUND" })
  })

  it("throws a 401 AppError when the current password is wrong", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      email: "old@test.com",
      passwordHash: "hashed",
    })
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    await expect(
      requestEmailChange("u1", { newEmail: "new@test.com", currentPassword: "wrong" }),
    ).rejects.toMatchObject({ statusCode: 401, code: "INVALID_CURRENT_PASSWORD" })
  })

  it("throws a 400 AppError when the new email matches the current email", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      email: "same@test.com",
      passwordHash: "hashed",
    })
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    await expect(
      requestEmailChange("u1", { newEmail: "same@test.com", currentPassword: "old" }),
    ).rejects.toMatchObject({ statusCode: 400, code: "EMAIL_UNCHANGED" })
  })

  it("throws a 409 AppError when the new email is already taken", async () => {
    prismaMock.user.findUnique
      .mockResolvedValueOnce({ id: "u1", email: "old@test.com", passwordHash: "hashed" })
      .mockResolvedValueOnce({ id: "u2", email: "new@test.com" })
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    await expect(
      requestEmailChange("u1", { newEmail: "new@test.com", currentPassword: "old" }),
    ).rejects.toMatchObject({ statusCode: 409, code: "EMAIL_ALREADY_EXISTS" })
  })

  it("stores the pending email/token and sends a verification email", async () => {
    prismaMock.user.findUnique
      .mockResolvedValueOnce({ id: "u1", email: "old@test.com", passwordHash: "hashed" })
      .mockResolvedValueOnce(null)
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)
    vi.mocked(signEmailChangeToken).mockReturnValue("signed-token")
    prismaMock.user.update.mockResolvedValue({
      id: "u1",
      email: "old@test.com",
      pendingEmail: "new@test.com",
    })

    const result = await requestEmailChange("u1", {
      newEmail: "new@test.com",
      currentPassword: "old",
    })

    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "u1" },
        data: expect.objectContaining({
          pendingEmail: "new@test.com",
          pendingEmailToken: "signed-token",
        }),
      }),
    )
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: "new@test.com" }),
    )
    expect(result).toMatchObject({ pendingEmail: "new@test.com" })
  })
})

describe("confirmEmailChange", () => {
  it("throws a 400 AppError when the token fails signature/expiry verification", async () => {
    vi.mocked(verifyEmailChangeToken).mockImplementation(() => {
      throw new Error("jwt expired")
    })

    await expect(confirmEmailChange("bad-token")).rejects.toMatchObject({
      statusCode: 400,
      code: "INVALID_OR_EXPIRED_TOKEN",
    })
  })

  it("throws a 404 AppError when the user no longer exists", async () => {
    vi.mocked(verifyEmailChangeToken).mockReturnValue({
      userId: "missing-user",
      newEmail: "new@test.com",
      purpose: "email-change",
    })
    prismaMock.user.findUnique.mockResolvedValue(null)

    await expect(confirmEmailChange("token")).rejects.toMatchObject({
      statusCode: 404,
      code: "USER_NOT_FOUND",
    })
  })

  it("throws a 400 AppError when the stored pending token does not match", async () => {
    vi.mocked(verifyEmailChangeToken).mockReturnValue({
      userId: "u1",
      newEmail: "new@test.com",
      purpose: "email-change",
    })
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      pendingEmail: "new@test.com",
      pendingEmailToken: "a-different-token",
      pendingEmailExpiresAt: new Date(Date.now() + 60_000),
    })

    await expect(confirmEmailChange("token")).rejects.toMatchObject({
      statusCode: 400,
      code: "INVALID_OR_EXPIRED_TOKEN",
    })
  })

  it("throws a 400 AppError when the pending token has expired", async () => {
    vi.mocked(verifyEmailChangeToken).mockReturnValue({
      userId: "u1",
      newEmail: "new@test.com",
      purpose: "email-change",
    })
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      pendingEmail: "new@test.com",
      pendingEmailToken: "token",
      pendingEmailExpiresAt: new Date(Date.now() - 60_000),
    })

    await expect(confirmEmailChange("token")).rejects.toMatchObject({
      statusCode: 400,
      code: "INVALID_OR_EXPIRED_TOKEN",
    })
  })

  it("updates the email and clears pending columns on success", async () => {
    vi.mocked(verifyEmailChangeToken).mockReturnValue({
      userId: "u1",
      newEmail: "new@test.com",
      purpose: "email-change",
    })
    prismaMock.user.findUnique.mockResolvedValue({
      id: "u1",
      pendingEmail: "new@test.com",
      pendingEmailToken: "token",
      pendingEmailExpiresAt: new Date(Date.now() + 60_000),
    })
    prismaMock.user.update.mockResolvedValue({ id: "u1", email: "new@test.com" })

    const result = await confirmEmailChange("token")

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: {
        email: "new@test.com",
        pendingEmail: null,
        pendingEmailToken: null,
        pendingEmailExpiresAt: null,
      },
      select: expect.anything(),
    })
    expect(result).toMatchObject({ id: "u1", email: "new@test.com" })
  })
})
