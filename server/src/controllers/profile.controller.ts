import { Request, Response } from "express"
import {
  changePassword,
  confirmEmailChange,
  requestEmailChange,
  updateProfile,
} from "../services/profile.service"
import { AuthRequest } from "../types/auth"
import { asyncHandler } from "../utils/asyncHandler"
import { AppError } from "../utils/AppError"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const updateProfileHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const { name, phone } = req.body

    if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
      throw new AppError("name cannot be empty", 400, "INVALID_NAME")
    }

    if (phone !== undefined && typeof phone !== "string") {
      throw new AppError("phone must be a string", 400, "INVALID_PHONE")
    }

    const updatedUser = await updateProfile(req.user.userId, { name, phone })

    req.log.info({ userId: req.user.userId }, "Profile updated")

    return res.status(200).json(updatedUser)
  },
)

export const changePasswordHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      throw new AppError(
        "currentPassword and newPassword are required",
        400,
        "PASSWORD_CHANGE_REQUIRED_FIELDS_MISSING",
      )
    }

    if (newPassword.length < 6) {
      throw new AppError(
        "Password must be at least 6 characters",
        400,
        "PASSWORD_TOO_SHORT",
      )
    }

    await changePassword(req.user.userId, { currentPassword, newPassword })

    req.log.info({ userId: req.user.userId }, "Password changed")

    return res.status(200).json({ message: "Password changed successfully" })
  },
)

export const requestEmailChangeHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
    }

    const { newEmail, currentPassword } = req.body

    if (!newEmail || typeof newEmail !== "string" || !EMAIL_REGEX.test(newEmail)) {
      throw new AppError("A valid newEmail is required", 400, "INVALID_EMAIL")
    }

    if (!currentPassword) {
      throw new AppError(
        "currentPassword is required",
        400,
        "CURRENT_PASSWORD_REQUIRED",
      )
    }

    const updatedUser = await requestEmailChange(req.user.userId, {
      newEmail,
      currentPassword,
    })

    req.log.info(
      { userId: req.user.userId, newEmail },
      "Email change requested",
    )

    return res.status(200).json(updatedUser)
  },
)

export const confirmEmailChangeHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.body

    if (!token || typeof token !== "string") {
      throw new AppError("token is required", 400, "TOKEN_REQUIRED")
    }

    const updatedUser = await confirmEmailChange(token)

    req.log.info({ userId: updatedUser.id }, "Email change confirmed")

    return res.status(200).json(updatedUser)
  },
)
