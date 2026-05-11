import { prisma } from "../lib/prisma"
import { GetProductsParams } from "../types/params"
import { CreateProductInput } from "../types/product"
import { UpdateProductInput } from "../types/product"
import { buildPaginationMeta } from "../utils/pagination"

export const getAllProducts = async ({
  categorySlug,
  active = "active",
  search,
  sort = "newest",
  availableOnly = false,
  stock = "all",
  page = 1,
  limit = 12,
}: GetProductsParams = {}) => {
  const trimmedSearch = search?.trim()
  const skip = (page - 1) * limit

  const activeWhere =
    active === "active"
      ? { isActive: true }
      : active === "inactive"
        ? { isActive: false }
        : {}

  const stockWhere =
    stock === "out_of_stock"
      ? {
          stockQuantity: {
            equals: 0,
          },
        }
      : stock === "in_stock" || availableOnly
        ? {
            stockQuantity: {
              gt: 0,
            },
          }
        : {}

  const where = {
    ...activeWhere,

    ...(categorySlug
      ? {
          category: {
            slug: categorySlug,
          },
        }
      : {}),

    ...stockWhere,

    ...(trimmedSearch
      ? {
          OR: [
            {
              name: {
                contains: trimmedSearch,
                mode: "insensitive" as const,
              },
            },
            {
              description: {
                contains: trimmedSearch,
                mode: "insensitive" as const,
              },
            },
            {
              material: {
                contains: trimmedSearch,
                mode: "insensitive" as const,
              },
            },
            {
              color: {
                contains: trimmedSearch,
                mode: "insensitive" as const,
              },
            },
            {
              category: {
                name: {
                  contains: trimmedSearch,
                  mode: "insensitive" as const,
                },
              },
            },
          ],
        }
      : {}),
  }

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const }

  const [products, totalItems] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),

    prisma.product.count({
      where,
    }),
  ])

  return {
    data: products,
    pagination: buildPaginationMeta({
      page,
      limit,
      totalItems,
    }),
  }
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
