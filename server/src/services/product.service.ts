import { prisma } from "../lib/prisma"
import { CreateProductInput } from "../types/product"
import { UpdateProductInput } from "../types/product"

type ProductSortOption = "newest" | "price_asc" | "price_desc"

type GetProductsParams = {
  categorySlug?: string
  activeOnly?: boolean
  search?: string
  sort?: ProductSortOption
  availableOnly?: boolean
}

export const getAllProducts = async ({
  categorySlug,
  activeOnly = true,
  search,
  sort = "newest",
  availableOnly = false,
}: GetProductsParams = {}) => {
  const trimmedSearch = search?.trim()

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

      ...(availableOnly
        ? {
            stockQuantity: {
              gt: 0,
            },
          }
        : {}),

      ...(trimmedSearch
        ? {
            OR: [
              {
                name: {
                  contains: trimmedSearch,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: trimmedSearch,
                  mode: "insensitive",
                },
              },
              {
                material: {
                  contains: trimmedSearch,
                  mode: "insensitive",
                },
              },
              {
                color: {
                  contains: trimmedSearch,
                  mode: "insensitive",
                },
              },
              {
                category: {
                  name: {
                    contains: trimmedSearch,
                    mode: "insensitive",
                  },
                },
              },
            ],
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

    orderBy:
      sort === "price_asc"
        ? { price: "asc" }
        : sort === "price_desc"
          ? { price: "desc" }
          : { createdAt: "desc" },
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
