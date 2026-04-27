import { Router } from "express"
import {
  getCategoriesHandler,
  getCategoryBySlugHandler,
  createCategoryHandler,
} from "../controllers/category.controller"
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware"

const router = Router()

router.get("/", getCategoriesHandler)
router.get("/:slug", getCategoryBySlugHandler)

router.post("/", requireAuth, requireAdmin, createCategoryHandler)

export default router
