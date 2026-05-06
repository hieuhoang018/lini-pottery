import { Request, Response } from "express"
import {
  createProduct,
  getAllProducts,
  getProductBySlug,
  getProductById,
  updateProduct,
  updateProductStock,
  updateProductActiveStatus,
} from "../services/product.service"
import { prisma } from "../lib/prisma"
import { asyncHandler } from "../utils/asyncHandler"
import { AppError } from "../utils/AppError"
import { ProductIdParams, ProductSlugParams } from "../types/params"
import { ProductQuery } from "../types/query"

export const getProductsHandler = asyncHandler(
  async (req: Request<{}, {}, {}, ProductQuery>, res: Response) => {
    const categorySlug = req.query.category
    const search = req.query.search
    const sort = req.query.sort || "newest"
    const availableOnly = req.query.availableOnly === "true"
    const stock = req.query.stock || "all"

    const products = await getAllProducts({
      categorySlug,
      active: "active",
      search,
      sort,
      availableOnly,
      stock,
    })

    return res.status(200).json(products)
  },
)

export const getProductByIdHandler = async (
  req: Request<ProductIdParams>,
  res: Response,
) => {
  try {
    const { id } = req.params

    const product = await getProductById(id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    return res.status(200).json(product)
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return res.status(500).json({ message: "Failed to fetch product" })
  }
}

export const getProductBySlugHandler = asyncHandler(
  async (req: Request<ProductSlugParams>, res: Response) => {
    const { slug } = req.params

    const product = await getProductBySlug(slug)

    if (!product) {
      throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND")
    }

    return res.status(200).json(product)
  },
)

export const createProductHandler = asyncHandler(
  async (req: Request, res: Response) => {
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
      throw new AppError(
        "name, slug, description, price, and categoryId are required",
        400,
        "PRODUCT_REQUIRED_FIELDS_MISSING",
      )
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!categoryExists) {
      throw new AppError("Invalid categoryId", 400, "INVALID_CATEGORY_ID")
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

    return res.status(201).json(product)
  },
)

export const updateProductHandler = asyncHandler(
  async (req: Request<ProductIdParams>, res: Response) => {
    const { id } = req.params

    const existingProduct = await getProductById(id)

    if (!existingProduct) {
      throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND")
    }

    const updatedProduct = await updateProduct(id, req.body)

    return res.status(200).json(updatedProduct)
  },
)

export const updateProductStockHandler = asyncHandler(
  async (req: Request<ProductIdParams>, res: Response) => {
    const { id } = req.params
    const { stockQuantity } = req.body

    if (stockQuantity === undefined) {
      throw new AppError(
        "stockQuantity is required",
        400,
        "STOCK_QUANTITY_REQUIRED",
      )
    }

    const numericStock = Number(stockQuantity)

    if (Number.isNaN(numericStock) || numericStock < 0) {
      throw new AppError(
        "stockQuantity must be a valid non-negative number",
        400,
        "INVALID_STOCK_QUANTITY",
      )
    }

    const existingProduct = await getProductById(id)

    if (!existingProduct) {
      throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND")
    }

    const product = await updateProductStock(id, numericStock)

    return res.status(200).json(product)
  },
)

export const updateProductActiveStatusHandler = asyncHandler(
  async (req: Request<ProductIdParams>, res: Response) => {
    const { id } = req.params
    const { isActive } = req.body

    if (typeof isActive !== "boolean") {
      throw new AppError(
        "isActive must be a boolean",
        400,
        "INVALID_ACTIVE_STATUS",
      )
    }

    const existingProduct = await getProductById(id)

    if (!existingProduct) {
      throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND")
    }

    const product = await updateProductActiveStatus(id, isActive)

    return res.status(200).json(product)
  },
)

export const getAdminProductsHandler = asyncHandler(
  async (req: Request<{}, {}, {}, ProductQuery>, res: Response) => {
    const categorySlug = req.query.category
    const search = req.query.search
    const sort = req.query.sort || "newest"
    const availableOnly = req.query.availableOnly === "true"
    const stock = req.query.stock || "all"
    const active = req.query.active || "all"

    const products = await getAllProducts({
      categorySlug,
      active,
      search,
      sort,
      availableOnly,
      stock,
    })

    return res.status(200).json(products)
  },
)
