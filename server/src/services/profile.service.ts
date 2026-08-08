import bcrypt from "bcrypt"
import { prisma } from "../lib/prisma"
import { sendMail } from "../lib/mailer"
import {
  ChangePasswordInput,
  RequestEmailChangeInput,
  UpdateProfileInput,
} from "../types/profile"
import { AppError } from "../utils/AppError"
import { signEmailChangeToken, verifyEmailChangeToken } from "../utils/token"
import { safeUserSelect } from "./auth.service"

const EMAIL_CHANGE_TOKEN_TTL_MS = 60 * 60 * 1000

export const updateProfile = async (
  userId: string,
  data: UpdateProfileInput,
) => {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } })

  if (!existingUser) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND")
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name ?? existingUser.name,
      phone: data.phone ?? existingUser.phone,
    },
    select: safeUserSelect,
  })

  return updatedUser
}

export const changePassword = async (
  userId: string,
  data: ChangePasswordInput,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND")
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    data.currentPassword,
    user.passwordHash,
  )

  if (!isCurrentPasswordValid) {
    throw new AppError("Current password is incorrect", 401, "INVALID_CURRENT_PASSWORD")
  }

  const passwordHash = await bcrypt.hash(data.newPassword, 10)

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  })
}

export const requestEmailChange = async (
  userId: string,
  data: RequestEmailChangeInput,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND")
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    data.currentPassword,
    user.passwordHash,
  )

  if (!isCurrentPasswordValid) {
    throw new AppError("Current password is incorrect", 401, "INVALID_CURRENT_PASSWORD")
  }

  if (data.newEmail === user.email) {
    throw new AppError(
      "New email must be different from the current email",
      400,
      "EMAIL_UNCHANGED",
    )
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: data.newEmail },
  })

  if (existingUser) {
    throw new AppError("Email already exists", 409, "EMAIL_ALREADY_EXISTS")
  }

  const token = signEmailChangeToken({ userId, newEmail: data.newEmail })
  const pendingEmailExpiresAt = new Date(Date.now() + EMAIL_CHANGE_TOKEN_TTL_MS)

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      pendingEmail: data.newEmail,
      pendingEmailToken: token,
      pendingEmailExpiresAt,
    },
    select: safeUserSelect,
  })

  const verifyUrl = `${process.env.CLIENT_URL}/account/verify-email?token=${token}`

  await sendMail({
    to: data.newEmail,
    subject: "Xác nhận đổi email - Lini Pottery",
    html: `<p>Nhấn vào liên kết sau để xác nhận đổi email của bạn sang <strong>${data.newEmail}</strong>:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>Liên kết có hiệu lực trong 1 giờ. Nếu bạn không yêu cầu thay đổi này, hãy bỏ qua email này.</p>`,
  })

  return updatedUser
}

export const confirmEmailChange = async (token: string) => {
  let payload

  try {
    payload = verifyEmailChangeToken(token)
  } catch {
    throw new AppError("Invalid or expired token", 400, "INVALID_OR_EXPIRED_TOKEN")
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } })

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND")
  }

  const isPending =
    user.pendingEmailToken === token &&
    user.pendingEmail === payload.newEmail &&
    user.pendingEmailExpiresAt !== null &&
    user.pendingEmailExpiresAt > new Date()

  if (!isPending) {
    throw new AppError("Invalid or expired token", 400, "INVALID_OR_EXPIRED_TOKEN")
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      email: payload.newEmail,
      pendingEmail: null,
      pendingEmailToken: null,
      pendingEmailExpiresAt: null,
    },
    select: safeUserSelect,
  })

  return updatedUser
}
