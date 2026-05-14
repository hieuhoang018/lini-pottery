import { Request, Response } from "express"
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
} from "../services/category.service"
import { asyncHandler } from "../utils/asyncHandler"
import { AppError } from "../utils/AppError"
import { CategoryParams } from "../types/params"

type CreateCategoryBody = {
  name?: string
  slug?: string
  description?: string
}

export const getCategoriesHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await getAllCategories()

    return res.status(200).json(categories)
  },
)

export const getCategoryBySlugHandler = asyncHandler(
  async (req: Request<CategoryParams>, res: Response) => {
    const { slug } = req.params

    const category = await getCategoryBySlug(slug)

    if (!category) {
      throw new AppError("Category not found", 404, "CATEGORY_NOT_FOUND")
    }

    return res.status(200).json(category)
  },
)

export const createCategoryHandler = asyncHandler(
  async (req: Request<{}, {}, CreateCategoryBody>, res: Response) => {
    const { name, slug, description } = req.body

    if (!name?.trim()) {
      throw new AppError(
        "Category name is required",
        400,
        "CATEGORY_NAME_REQUIRED",
      )
    }

    const category = await createCategory({
      name,
      slug,
      description,
    })

    return res.status(201).json(category)
  },
)
