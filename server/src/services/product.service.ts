import { prisma } from "../lib/prisma"
import { GetProductsParams } from "../types/params"
import { CreateProductInput } from "../types/product"
import { UpdateProductInput } from "../types/product"
import { buildPaginationMeta } from "../utils/pagination"
import { buildProductSearchText, normalizeSearchText } from "../utils/search"
import { deleteImageFromCloudinary } from "../utils/cloudinaryUpload"
import { AppError } from "../utils/AppError"

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
  const normalizedSearch = search?.trim()
    ? normalizeSearchText(search.trim())
    : undefined
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

    ...(normalizedSearch
      ? {
          searchText: {
            contains: normalizedSearch,
            mode: "insensitive" as const,
          },
        }
      : {}),
  }

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const }

  const [products, totalItems] = await Promise.all([
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
  const category = await prisma.category.findUnique({
    where: {
      id: data.categoryId,
    },
  })

  if (!category) {
    throw new AppError("Category not found", 404, "CATEGORY_NOT_FOUND")
  }

  const searchText = buildProductSearchText({
    name: data.name,
    slug: data.slug,
    description: data.description,
    material: data.material,
    color: data.color,
    dimensionsText: data.dimensionsText,
    weightText: data.weightText,
    careInstructions: data.careInstructions,
    categoryName: category?.name,
  })

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
      featuredImagePublicId: data.featuredImagePublicId,
      searchText,
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
  const existingProduct = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  })

  if (!existingProduct) {
    return null
  }

  const oldFeaturedImagePublicId = existingProduct.featuredImagePublicId

  const nextCategoryId = data.categoryId ?? existingProduct.categoryId

  const nextCategory =
    nextCategoryId !== existingProduct.categoryId
      ? await prisma.category.findUnique({
          where: {
            id: nextCategoryId,
          },
        })
      : existingProduct.category

  const searchText = buildProductSearchText({
    name: data.name ?? existingProduct.name,
    slug: data.slug ?? existingProduct.slug,
    description: data.description ?? existingProduct.description,
    material: data.material ?? existingProduct.material,
    color: data.color ?? existingProduct.color,
    dimensionsText: data.dimensionsText ?? existingProduct.dimensionsText,
    weightText: data.weightText ?? existingProduct.weightText,
    careInstructions: data.careInstructions ?? existingProduct.careInstructions,
    categoryName: nextCategory?.name,
  })

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      searchText,
    },
    include: {
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  })

  const newFeaturedImagePublicId = updatedProduct.featuredImagePublicId

  const imageWasReplaced =
    oldFeaturedImagePublicId &&
    newFeaturedImagePublicId &&
    oldFeaturedImagePublicId !== newFeaturedImagePublicId

  if (imageWasReplaced) {
    try {
      await deleteImageFromCloudinary(oldFeaturedImagePublicId)
    } catch (error) {
      console.error("Failed to delete old Cloudinary image:", error)
    }
  }

  return updatedProduct
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
