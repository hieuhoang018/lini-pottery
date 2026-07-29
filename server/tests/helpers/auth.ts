import bcrypt from "bcrypt"
import { prisma } from "../../src/lib/prisma"
import { signAccessToken } from "../../src/utils/token"

let counter = 0
const uniqueEmail = () => `user-${Date.now()}-${counter++}@test.com`

export const createUser = async (
  overrides: { role?: "CUSTOMER" | "ADMIN"; email?: string } = {},
) => {
  const role = overrides.role ?? "CUSTOMER"
  const email = overrides.email ?? uniqueEmail()
  const passwordHash = await bcrypt.hash("password123", 10)

  const user = await prisma.user.create({
    data: { name: "Test User", email, passwordHash, role },
  })

  await prisma.cart.create({ data: { userId: user.id } })

  const accessToken = signAccessToken({ userId: user.id, role })

  return { user, accessToken }
}

export const authHeader = (token: string) => `Bearer ${token}`
