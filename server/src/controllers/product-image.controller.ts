import { Request, Response } from "express"
import { prisma } from "../lib/prisma"
import {
  createProductImage,
  deleteProductImage,
  getImagesByProductId,
  getProductImageById,
} from "../services/product-image.service"

type ProductIdParams = {
  productId: string
}

type ProductImageIdParams = {
  id: string
}

type CreateProductImageBody = {
  imageUrl?: string
  altText?: string
  sortOrder?: number | string
}

export const getProductImagesHandler = async (
  req: Request<ProductIdParams>,
  res: Response,
) => {
  try {
    const { productId } = req.params

    const images = await getImagesByProductId(productId)

    return res.status(200).json(images)
  } catch (error) {
    console.error("Failed to fetch product images:", error)
    return res.status(500).json({ message: "Failed to fetch product images" })
  }
}

export const createProductImageHandler = async (
  req: Request<ProductIdParams, {}, CreateProductImageBody>,
  res: Response,
) => {
  try {
    const { productId } = req.params

    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        message: "Request body is required and must be valid JSON",
      })
    }

    const { imageUrl, altText, sortOrder } = req.body

    if (!imageUrl) {
      return res.status(400).json({
        message: "imageUrl is required",
      })
    }

    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!productExists) {
      return res.status(404).json({
        message: "Product not found",
      })
    }

    const numericSortOrder =
      sortOrder !== undefined ? Number(sortOrder) : undefined

    if (numericSortOrder !== undefined && Number.isNaN(numericSortOrder)) {
      return res.status(400).json({
        message: "sortOrder must be a valid number",
      })
    }

    const image = await createProductImage({
      productId,
      imageUrl,
      altText,
      sortOrder: numericSortOrder,
    })

    return res.status(201).json(image)
  } catch (error) {
    console.error("Failed to create product image:", error)
    return res.status(500).json({ message: "Failed to create product image" })
  }
}

export const deleteProductImageHandler = async (
  req: Request<ProductImageIdParams>,
  res: Response,
) => {
  try {
    const { id } = req.params

    const existingImage = await getProductImageById(id)

    if (!existingImage) {
      return res.status(404).json({
        message: "Product image not found",
      })
    }

    await deleteProductImage(id)

    return res.status(200).json({
      message: "Product image deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete product image:", error)
    return res.status(500).json({ message: "Failed to delete product image" })
  }
}
