import { Router } from "express"
import {
  checkoutHandler,
  getMyOrderByIdHandler,
  getMyOrdersHandler,
  guestCheckoutHandler,
} from "../controllers/order.controller"
import { requireAuth } from "../middlewares/auth.middleware"
import { guestCheckoutRateLimiter } from "../middlewares/rateLimit.middleware"

const router = Router()

router.post("/guest-checkout", guestCheckoutRateLimiter, guestCheckoutHandler)

router.use(requireAuth)

router.post("/checkout", checkoutHandler)
router.get("/my", getMyOrdersHandler)
router.get("/:id", getMyOrderByIdHandler)

export default router
