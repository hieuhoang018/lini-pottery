import { Request, Response } from "express"
import {
  createProduct,
  getAllProducts,
  getProductBySlug,
} from "../services/product.service"
import { prisma } from "../lib/prisma"

type ProductSlugParams = {
  slug: string
}

type ProductQuery = {
  category?: string
  active?: string
}

export const getProductsHandler = async (
  req: Request<{}, {}, {}, ProductQuery>,
  res: Response,
) => {
  try {
    const categorySlug = req.query.category
    const activeOnly = req.query.active === "false" ? false : true

    const products = await getAllProducts({
      categorySlug,
      activeOnly,
    })

    res.status(200).json(products)
  } catch (error) {
    console.error("Failed to fetch products:", error)
    res.status(500).json({ message: "Failed to fetch products" })
  }
}

export const getProductBySlugHandler = async (
  req: Request<ProductSlugParams>,
  res: Response,
) => {
  try {
    const { slug } = req.params

    const product = await getProductBySlug(slug)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.status(200).json(product)
  } catch (error) {
    console.error("Failed to fetch product:", error)
    res.status(500).json({ message: "Failed to fetch product" })
  }
}

export const createProductHandler = async (req: Request, res: Response) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      stockQuantity,
      isActive,
      categoryId,
      material,
      color,
      dimensionsText,
      weightText,
      careInstructions,
      featuredImageUrl,
    } = req.body

    if (!name || !slug || !description || price == null || !categoryId) {
      return res.status(400).json({
        message: "name, slug, description, price, and categoryId are required",
      })
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!categoryExists) {
      return res.status(400).json({
        message: "Invalid categoryId",
      })
    }

    const product = await createProduct({
      name,
      slug,
      description,
      price: Number(price),
      stockQuantity:
        stockQuantity !== undefined ? Number(stockQuantity) : undefined,
      isActive,
      categoryId,
      material,
      color,
      dimensionsText,
      weightText,
      careInstructions,
      featuredImageUrl,
    })

    res.status(201).json(product)
  } catch (error: any) {
    console.error("Failed to create product:", error)

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Product slug already exists",
      })
    }

    res.status(500).json({ message: "Failed to create product" })
  }
}
