import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma"
import { LoginInput, RegisterInput } from "../types/auth"

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set")
}

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS")
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
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    })

    await tx.cart.create({
      data: {
        userId: createdUser.id,
      },
    })

    return createdUser
  })

  return user
}

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (!user) {
    throw new Error("INVALID_CREDENTIALS")
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash)

  if (!isPasswordValid) {
    throw new Error("INVALID_CREDENTIALS")
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )

  return {
    token,
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
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
    },
  })
}
