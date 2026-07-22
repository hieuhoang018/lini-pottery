import { Router } from "express"
import {
  loginHandler,
  logoutHandler,
  meHandler,
  refreshHandler,
  registerHandler,
} from "../controllers/auth.controller"
import { requireAuth } from "../middlewares/auth.middleware"
import { authRateLimiter } from "../middlewares/rateLimit.middleware"

const router = Router()

router.post("/register", authRateLimiter, registerHandler)
router.post("/login", authRateLimiter, loginHandler)
router.post("/refresh", authRateLimiter, refreshHandler)
router.post("/logout", logoutHandler)
router.get("/me", requireAuth, meHandler)

export default router
