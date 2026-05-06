import { Router } from "express"
import { getAdminProductsHandler } from "../controllers/product.controller"
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware"

const router = Router()

router.get("/", requireAuth, requireAdmin, getAdminProductsHandler)

export default router
