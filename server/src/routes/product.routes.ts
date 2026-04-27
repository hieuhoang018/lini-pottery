import { Router } from "express"
import {
  createProductHandler,
  getProductBySlugHandler,
  getProductsHandler,
  updateProductHandler,
  updateProductStockHandler,
  updateProductActiveStatusHandler,
} from "../controllers/product.controller"
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware"

const router = Router()

router.get("/", getProductsHandler)
router.get("/slug/:slug", getProductBySlugHandler)

router.post("/", requireAuth, requireAdmin, createProductHandler)
router.patch("/:id", requireAuth, requireAdmin, updateProductHandler)
router.patch("/:id/stock", requireAuth, requireAdmin, updateProductStockHandler)
router.patch(
  "/:id/active",
  requireAuth,
  requireAdmin,
  updateProductActiveStatusHandler,
)

export default router
