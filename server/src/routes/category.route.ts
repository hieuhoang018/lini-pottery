import { Router } from "express"
import {
  getCategoriesHandler,
  getCategoryBySlugHandler,
  createCategoryHandler,
} from "../controllers/category.controller"

const router = Router()

router.get("/", getCategoriesHandler)
router.get("/:slug", getCategoryBySlugHandler)
router.post("/", createCategoryHandler)

export default router
