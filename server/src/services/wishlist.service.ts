import { prisma } from "../lib/prisma"

export const getWishlist = async (userId: string) => {
  return prisma.wishlistItem.findMany({
    where: { userId },
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
  })
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
