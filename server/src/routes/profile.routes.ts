import { Router } from "express"
import {
  changePasswordHandler,
  confirmEmailChangeHandler,
  requestEmailChangeHandler,
  updateProfileHandler,
} from "../controllers/profile.controller"
import { requireAuth } from "../middlewares/auth.middleware"
import { meRateLimiter } from "../middlewares/rateLimit.middleware"

const router = Router()

router.patch("/", requireAuth, meRateLimiter, updateProfileHandler)
router.post("/password", requireAuth, meRateLimiter, changePasswordHandler)
router.post(
  "/email-change",
  requireAuth,
  meRateLimiter,
  requestEmailChangeHandler,
)
router.post(
  "/email-change/confirm",
  meRateLimiter,
  confirmEmailChangeHandler,
)

export default router
