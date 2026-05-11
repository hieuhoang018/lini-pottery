import { Request, Response } from "express"
import { getUserById, loginUser, registerUser } from "../services/auth.service"
import { AuthRequest } from "../middlewares/auth.middleware"
import { asyncHandler } from "../utils/asyncHandler"
import { AppError } from "../utils/AppError"
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/token"

const REFRESH_TOKEN_COOKIE_NAME = "refreshToken"

const getRefreshCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
}

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

    const result = await registerUser({ name, email, password, phone })

    const payload = {
      userId: result.user.id,
      role: result.user.role,
    }

    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      getRefreshCookieOptions(),
    )

    return res.status(201).json({
      user: result.user,
      accessToken,
    })
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

    const payload = {
      userId: result.user.id,
      role: result.user.role,
    }

    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      getRefreshCookieOptions(),
    )

    return res.status(200).json({
      user: result.user,
      accessToken,
    })
  },
)

export const refreshHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME]

    if (!refreshToken) {
      throw new AppError("Refresh token missing", 401, "REFRESH_TOKEN_MISSING")
    }

    try {
      const payload = verifyRefreshToken(refreshToken)

      const user = await getUserById(payload.userId)

      if (!user) {
        throw new AppError("User not found", 404, "USER_NOT_FOUND")
      }

      const accessToken = signAccessToken({
        userId: user.id,
        role: user.role,
      })

      return res.status(200).json({
        accessToken,
        user,
      })
    } catch {
      throw new AppError(
        "Invalid or expired refresh token",
        401,
        "INVALID_REFRESH_TOKEN",
      )
    }
  },
)

export const logoutHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    return res.status(200).json({
      message: "Logged out successfully",
    })
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
