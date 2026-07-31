import { NextFunction, Response } from "express"
import { AuthRequest } from "../types/auth"
import { AppError } from "../utils/AppError"
import { verifyAccessToken } from "../utils/token"

export const requireAuth = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = verifyAccessToken(token)
    req.user = decoded
    next()
  } catch {
    throw new AppError("Invalid or expired token", 401, "INVALID_ACCESS_TOKEN")
  }
}

export const requireAdmin = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "ADMIN") {
    throw new AppError("Admin access required", 403, "ADMIN_ACCESS_REQUIRED")
  }

  next()
}
