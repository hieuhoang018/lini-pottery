import { Request, Response } from "express"
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
} from "../services/category.service"

type CategoryParams = {
  slug: string
}

export const getCategoriesHandler = async (_req: Request, res: Response) => {
  try {
    const categories = await getAllCategories()
    res.status(200).json(categories)
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    res.status(500).json({ message: "Failed to fetch categories" })
  }
}

export const getCategoryBySlugHandler = async (
  req: Request<CategoryParams>,
  res: Response,
) => {
  try {
    const { slug } = req.params

    const category = await getCategoryBySlug(slug)

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.status(200).json(category)
  } catch (error) {
    console.error("Failed to fetch category:", error)
    res.status(500).json({ message: "Failed to fetch category" })
  }
}

export const createCategoryHandler = async (req: Request, res: Response) => {
  try {
    const { name, slug } = req.body

    if (!name || !slug) {
      return res.status(400).json({
        message: "Name and slug are required",
      })
    }

    const category = await createCategory({
      name,
      slug,
    })

    res.status(201).json(category)
  } catch (error: any) {
    console.error("Failed to create category:", error)

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Category slug already exists",
      })
    }

    res.status(500).json({ message: "Failed to create category" })
  }
}
