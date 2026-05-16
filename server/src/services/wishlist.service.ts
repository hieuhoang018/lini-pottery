import { Prisma } from "@prisma/client"
import { prisma } from "../lib/prisma"
import { GetWishlistParams } from "../types/params"
import { buildPaginationMeta } from "../utils/pagination"
import { normalizeSearchText } from "../utils/search"

export const getWishlist = async ({
  userId,
  search,
  page = 1,
  limit = 10,
}: GetWishlistParams) => {
  const normalizedSearch = search?.trim()
    ? normalizeSearchText(search.trim())
    : undefined

  const skip = (page - 1) * limit

  const where: Prisma.WishlistItemWhereInput = {
    userId,

    ...(normalizedSearch
      ? {
          product: {
            searchText: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
        }
      : {}),
  }

  const [wishlistItems, totalItems] = await Promise.all([
    prisma.wishlistItem.findMany({
      where,
      include: {
        product: {
          include: {
            category: true,
            images: {
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.wishlistItem.count({
      where,
    }),
  ])

  return {
    data: wishlistItems,
    pagination: buildPaginationMeta({
      page,
      limit,
      totalItems,
    }),
  }
}

export const addWishlistItem = async (userId: string, productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product || !product.isActive) {
    throw new Error("PRODUCT_NOT_AVAILABLE")
  }

  return prisma.wishlistItem.upsert({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    update: {},
    create: {
      userId,
      productId,
    },
    include: {
      product: {
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  })
}

export const removeWishlistItem = async (userId: string, productId: string) => {
  const existingItem = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  })

  if (!existingItem) {
    throw new Error("WISHLIST_ITEM_NOT_FOUND")
  }

  return prisma.wishlistItem.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  })
}
