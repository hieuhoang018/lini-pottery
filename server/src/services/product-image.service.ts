import { prisma } from "../lib/prisma"
import { CreateProductImageInput } from "../types/product-image"
import { deleteImageFromCloudinary } from "../utils/cloudinaryUpload"
import { logger } from "../lib/logger"

export const getImagesByProductId = async (productId: string) => {
  return prisma.productImage.findMany({
    where: {
      productId,
    },
    orderBy: {
      sortOrder: "asc",
    },
  })
}

export const createProductImage = async (data: CreateProductImageInput) => {
  return prisma.productImage.create({
    data: {
      productId: data.productId,
      imageUrl: data.imageUrl,
      publicId: data.publicId,
      altText: data.altText,
      sortOrder: data.sortOrder ?? 0,
    },
  })
}

export const deleteProductImage = async (id: string) => {
  const existingImage = await prisma.productImage.findUnique({
    where: { id },
  })

  if (!existingImage) {
    return null
  }

  const deletedImage = await prisma.productImage.delete({
    where: { id },
  })

  if (existingImage.publicId) {
    try {
      await deleteImageFromCloudinary(existingImage.publicId)
    } catch (error) {
      logger.error({ err: error }, "Failed to delete gallery image from Cloudinary")
    }
  }

  return deletedImage
}

export const getProductImageById = async (id: string) => {
  return prisma.productImage.findUnique({
    where: { id },
  })
}
