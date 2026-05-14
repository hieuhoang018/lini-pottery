import { Request, Response } from "express"
import { prisma } from "../lib/prisma"
import {
  createProductImage,
  deleteProductImage,
  getImagesByProductId,
  getProductImageById,
} from "../services/product-image.service"
import { asyncHandler } from "../utils/asyncHandler"
import { AppError } from "../utils/AppError"
import { ProductImageIdParams } from "../types/params"

type ProductImagesParams = {
  productId: string
}

type CreateProductImageBody = {
  imageUrl?: string
  publicId?: string
  altText?: string
  sortOrder?: number | string
}

export const getProductImagesHandler = asyncHandler(
  async (req: Request<ProductImagesParams>, res: Response) => {
    const { productId } = req.params

    const images = await getImagesByProductId(productId)

    return res.status(200).json(images)
  },
)

export const createProductImageHandler = asyncHandler(
  async (
    req: Request<ProductImagesParams, {}, CreateProductImageBody>,
    res: Response,
  ) => {
    const { productId } = req.params

    if (!req.body || typeof req.body !== "object") {
      throw new AppError(
        "Request body is required and must be valid JSON",
        400,
        "INVALID_REQUEST_BODY",
      )
    }

    const { imageUrl, publicId, altText, sortOrder } = req.body

    if (!imageUrl) {
      throw new AppError("imageUrl is required", 400, "IMAGE_URL_REQUIRED")
    }

    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!productExists) {
      throw new AppError("Product not found", 404, "PRODUCT_NOT_FOUND")
    }

    const numericSortOrder =
      sortOrder !== undefined ? Number(sortOrder) : undefined

    if (numericSortOrder !== undefined && Number.isNaN(numericSortOrder)) {
      throw new AppError(
        "sortOrder must be a valid number",
        400,
        "INVALID_SORT_ORDER",
      )
    }

    const image = await createProductImage({
      productId,
      imageUrl,
      publicId,
      altText,
      sortOrder: numericSortOrder,
    })

    return res.status(201).json(image)
  },
)

export const deleteProductImageHandler = asyncHandler(
  async (req: Request<ProductImageIdParams>, res: Response) => {
    const { id } = req.params

    const existingImage = await getProductImageById(id)

    if (!existingImage) {
      throw new AppError(
        "Product image not found",
        404,
        "PRODUCT_IMAGE_NOT_FOUND",
      )
    }

    await deleteProductImage(id)

    return res.status(200).json({
      message: "Product image deleted successfully",
    })
  },
)
