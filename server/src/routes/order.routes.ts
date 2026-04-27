import { Router } from "express"
import {
  checkoutHandler,
  getMyOrderByIdHandler,
  getMyOrdersHandler,
} from "../controllers/order.controller"
import { requireAuth } from "../middlewares/auth.middleware"

const router = Router()

router.use(requireAuth)

router.post("/checkout", checkoutHandler)
router.get("/my", getMyOrdersHandler)
router.get("/:id", getMyOrderByIdHandler)

export default router
