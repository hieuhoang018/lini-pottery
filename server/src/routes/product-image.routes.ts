import { Router } from "express"
import {
  createProductImageHandler,
  deleteProductImageHandler,
  getProductImagesHandler,
} from "../controllers/product-image.controller"
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware"

const router = Router()

router.get("/products/:productId/images", getProductImagesHandler)

router.post(
  "/products/:productId/images",
  requireAuth,
  requireAdmin,
  createProductImageHandler,
)

router.delete(
  "/product-images/:id",
  requireAuth,
  requireAdmin,
  deleteProductImageHandler,
)

export default router
