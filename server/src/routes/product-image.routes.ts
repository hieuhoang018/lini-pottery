import { Router } from "express"
import {
  createProductImageHandler,
  deleteProductImageHandler,
  getProductImagesHandler,
} from "../controllers/product-image.controller"
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware"

const router = Router()

router.get("/products/:productId/images", getProductImagesHandler)

router.use(requireAuth)
router.use(requireAdmin)

router.post("/products/:productId/images", createProductImageHandler)
router.delete("/product-images/:id", deleteProductImageHandler)

export default router
