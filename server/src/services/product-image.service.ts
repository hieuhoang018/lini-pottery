import { prisma } from "../lib/prisma"
import { CreateProductImageInput } from "../types/product-image"

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
      altText: data.altText,
      sortOrder: data.sortOrder ?? 0,
    },
  })
}

export const deleteProductImage = async (id: string) => {
  return prisma.productImage.delete({
    where: { id },
  })
}

export const getProductImageById = async (id: string) => {
  return prisma.productImage.findUnique({
    where: { id },
  })
}
