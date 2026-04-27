import { Request, Response } from "express"
import { getUserById, loginUser, registerUser } from "../services/auth.service"
import { AuthRequest } from "../middlewares/auth.middleware"
import { asyncHandler } from "../utils/asyncHandler"
import { AppError } from "../utils/AppError"

export const registerHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, phone } = req.body

    if (!name || !email || !password) {
      throw new AppError(
        "name, email, and password are required",
        400,
        "AUTH_REQUIRED_FIELDS_MISSING",
      )
    }

    if (password.length < 6) {
      throw new AppError(
        "Password must be at least 6 characters",
        400,
        "PASSWORD_TOO_SHORT",
      )
    }

    const user = await registerUser({ name, email, password, phone })

    return res.status(201).json(user)
  },
)

export const loginHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
      throw new AppError(
        "email and password are required",
        400,
        "LOGIN_REQUIRED_FIELDS_MISSING",
      )
    }

    const result = await loginUser({ email, password })

    return res.status(200).json(result)
  },
)

export const meHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const user = await getUserById(req.user.userId)

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND")
    }

    return res.status(200).json(user)
  },
)
