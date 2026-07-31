import type { Request } from "express"

export type RegisterInput = {
  name: string
  email: string
  password: string
  phone?: string
}

export type LoginInput = {
  email: string
  password: string
}

export type JwtPayload = {
  userId: string
  role: "CUSTOMER" | "ADMIN"
}

export type AuthRequest = Request & {
  user?: JwtPayload
}
