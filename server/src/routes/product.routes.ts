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

router.use(requireAuth)
router.use(requireAdmin)

router.post("/", createProductHandler)
router.patch("/:id", updateProductHandler)
router.patch("/:id/stock", updateProductStockHandler)
router.patch("/:id/active", updateProductActiveStatusHandler)

export default router
