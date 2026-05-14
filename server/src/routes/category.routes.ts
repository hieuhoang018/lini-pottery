import { Router } from "express"
import {
  getCategoriesHandler,
  getCategoryBySlugHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from "../controllers/category.controller"
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware"

const router = Router()

router.get("/", getCategoriesHandler)

router.post("/", requireAuth, requireAdmin, createCategoryHandler)

router.patch("/:id", requireAuth, requireAdmin, updateCategoryHandler)

router.delete("/:id", requireAuth, requireAdmin, deleteCategoryHandler)

router.get("/:slug", getCategoryBySlugHandler)

export default router
