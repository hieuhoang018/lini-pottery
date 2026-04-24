import { Request, Response } from "express"
import { getUserById, loginUser, registerUser } from "../services/auth.service"
import { AuthRequest } from "../middlewares/auth.middleware"

export const registerHandler = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email, and password are required",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      })
    }

    const user = await registerUser({ name, email, password, phone })

    return res.status(201).json(user)
  } catch (error: any) {
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({ message: "Email already exists" })
    }

    console.error("Register failed:", error)
    return res.status(500).json({ message: "Register failed" })
  }
}

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
      })
    }

    const result = await loginUser({ email, password })

    return res.status(200).json(result)
  } catch (error: any) {
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    console.error("Login failed:", error)
    return res.status(500).json({ message: "Login failed" })
  }
}

export const meHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const user = await getUserById(req.user.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error("Get current user failed:", error)
    return res.status(500).json({ message: "Failed to get current user" })
  }
}
