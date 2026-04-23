import { Router } from "express"
import {
  createProductImageHandler,
  deleteProductImageHandler,
  getProductImagesHandler,
} from "../controllers/product-image.controller"

const router = Router()

router.get("/products/:productId/images", getProductImagesHandler)
router.post("/products/:productId/images", createProductImageHandler)
router.delete("/product-images/:id", deleteProductImageHandler)

export default router
