import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { JwtPayload } from "../types/auth"

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set")
}

export type AuthRequest = Request & {
  user?: JwtPayload
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access required" })
  }

  next()
}
