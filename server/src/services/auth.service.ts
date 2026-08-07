import bcrypt from "bcrypt"
import { prisma } from "../lib/prisma"
import { LoginInput, RegisterInput } from "../types/auth"
import { AppError } from "../utils/AppError"

export const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  phone: true,
  pendingEmail: true,
  createdAt: true,
} as const

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    throw new AppError("Email already exists", 409, "EMAIL_ALREADY_EXISTS")
  }

  const passwordHash = await bcrypt.hash(data.password, 10)

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        phone: data.phone,
      },
      select: safeUserSelect,
    })

    await tx.cart.create({
      data: {
        userId: createdUser.id,
      },
    })

    return createdUser
  })

  return {
    user,
  }
}

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (!user) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS")
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash)

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS")
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
    },
  }
}

export const getUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: safeUserSelect,
  })
}
