import { Request, Response } from "express"
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service"
import { asyncHandler } from "../utils/asyncHandler"
import { AppError } from "../utils/AppError"
import { AuthRequest } from "../types/auth"
import { CategoryIdParams, CategoryParams } from "../types/params"
import { CreateCategoryBody, UpdateCategoryBody } from "../types/category"

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
  async (
    req: AuthRequest & Request<{}, {}, CreateCategoryBody>,
    res: Response,
  ) => {
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

    req.log.info(
      { categoryId: category.id, name: category.name, adminId: req.user?.userId },
      "Category created",
    )

    return res.status(201).json(category)
  },
)

export const updateCategoryHandler = asyncHandler(
  async (
    req: AuthRequest & Request<CategoryIdParams, {}, UpdateCategoryBody>,
    res: Response,
  ) => {
    const { id } = req.params
    const { name, slug, description } = req.body

    if (name === undefined && slug === undefined && description === undefined) {
      throw new AppError(
        "At least one field is required",
        400,
        "CATEGORY_UPDATE_FIELDS_MISSING",
      )
    }

    const category = await updateCategory({
      id,
      name,
      slug,
      description,
    })

    req.log.info(
      { categoryId: id, changes: { name, slug, description }, adminId: req.user?.userId },
      "Category updated",
    )

    return res.status(200).json(category)
  },
)

export const deleteCategoryHandler = asyncHandler(
  async (req: AuthRequest & Request<CategoryIdParams>, res: Response) => {
    const { id } = req.params

    await deleteCategory(id)

    req.log.info({ categoryId: id, adminId: req.user?.userId }, "Category deleted")

    return res.status(204).send()
  },
)
