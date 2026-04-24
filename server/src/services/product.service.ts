import { prisma } from "../lib/prisma"
import { CreateProductInput } from "../types/product"
import { UpdateProductInput } from "../types/product"

type GetProductsParams = {
  categorySlug?: string
  activeOnly?: boolean
}

export const getAllProducts = async ({
  categorySlug,
  activeOnly = true,
}: GetProductsParams = {}) => {
  return prisma.product.findMany({
    where: {
      ...(activeOnly ? { isActive: true } : {}),
      ...(categorySlug
        ? {
            category: {
              slug: categorySlug,
            },
          }
        : {}),
    },
    include: {
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export const getProductBySlug = async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  })
}

export const createProduct = async (data: CreateProductInput) => {
  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      stockQuantity: data.stockQuantity ?? 1,
      isActive: data.isActive ?? true,
      categoryId: data.categoryId,
      material: data.material,
      color: data.color,
      dimensionsText: data.dimensionsText,
      weightText: data.weightText,
      careInstructions: data.careInstructions,
      featuredImageUrl: data.featuredImageUrl,
    },
    include: {
      category: true,
      images: true,
    },
  })
}

export const getProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
  })
}

export const updateProduct = async (id: string, data: UpdateProductInput) => {
  return prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  })
}

export const updateProductStock = async (id: string, stockQuantity: number) => {
  return prisma.product.update({
    where: { id },
    data: {
      stockQuantity,
    },
  })
}

export const updateProductActiveStatus = async (
  id: string,
  isActive: boolean,
) => {
  return prisma.product.update({
    where: { id },
    data: {
      isActive,
    },
  })
}
