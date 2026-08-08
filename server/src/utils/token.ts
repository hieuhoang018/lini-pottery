import jwt from "jsonwebtoken"
import { EmailChangeTokenPayload, JwtPayload } from "../types/auth"

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

if (!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not set")
}

if (!JWT_REFRESH_SECRET) {
  throw new Error("JWT_REFRESH_SECRET is not set")
}

export const signAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  })
}

export const signRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  })
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload
}

export const signEmailChangeToken = (payload: {
  userId: string
  newEmail: string
}) => {
  return jwt.sign(
    { ...payload, purpose: "email-change" },
    JWT_ACCESS_SECRET,
    { expiresIn: "1h" },
  )
}

export const verifyEmailChangeToken = (token: string): EmailChangeTokenPayload => {
  const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as EmailChangeTokenPayload

  if (decoded.purpose !== "email-change") {
    throw new Error("Invalid token purpose")
  }

  return decoded
}
