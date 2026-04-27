import { Router } from "express"
import {
  cancelAdminOrderHandler,
  getAdminOrderByIdHandler,
  getAdminOrdersHandler,
  updateAdminOrderStatusHandler,
  updateAdminPaymentStatusHandler,
} from "../controllers/admin-order.controller"
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware"

const router = Router()

router.use(requireAuth)
router.use(requireAdmin)

router.get("/", getAdminOrdersHandler)
router.get("/:id", getAdminOrderByIdHandler)
router.patch("/:id/status", updateAdminOrderStatusHandler)
router.patch("/:id/payment", updateAdminPaymentStatusHandler)
router.patch("/:id/cancel", cancelAdminOrderHandler)

export default router
