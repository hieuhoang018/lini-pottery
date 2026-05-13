import { Router } from "express"
import { uploadProductImageHandler } from "../controllers/upload.controller"
import { uploadProductImage } from "../middlewares/upload.middleware"
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware"

const router = Router()

router.post(
  "/product-image",
  requireAuth,
  requireAdmin,
  uploadProductImage.single("image"),
  uploadProductImageHandler,
)

export default router
