import { prisma } from "../lib/prisma"

const createCart = async (userId: string) => {
  let cart = await prisma.cart.create({
    data: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                orderBy: { sortOrder: "asc" },
              },
            },
          },
        },
      },
    },
  })

  return cart
}

export const getCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                orderBy: { sortOrder: "asc" },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!cart) {
    cart = await createCart(userId)
  }

  return cart
}

export const addItemToCart = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  const cart = await getCart(userId)

  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product || !product.isActive) {
    throw new Error("PRODUCT_NOT_AVAILABLE")
  }

  if (product.stockQuantity < quantity) {
    throw new Error("NOT_ENOUGH_STOCK")
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  })

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity

    if (product.stockQuantity < newQuantity) {
      throw new Error("NOT_ENOUGH_STOCK")
    }

    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
      include: { product: true },
    })
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
    include: { product: true },
  })
}

export const updateCartItemQuantity = async (
  itemId: string,
  userId: string,
  quantity: number,
) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: {
      cart: true,
      product: true,
    },
  })

  if (!item || item.cart.userId !== userId) {
    throw new Error("CART_ITEM_NOT_FOUND")
  }

  if (quantity <= 0) {
    return prisma.cartItem.delete({
      where: { id: itemId },
    })
  }

  if (item.product.stockQuantity < quantity) {
    throw new Error("NOT_ENOUGH_STOCK")
  }

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
    include: { product: true },
  })
}

export const removeCartItem = async (itemId: string, userId: string) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  })

  if (!item || item.cart.userId !== userId) {
    throw new Error("CART_ITEM_NOT_FOUND")
  }

  return prisma.cartItem.delete({
    where: { id: itemId },
  })
}

export const clearCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  })

  if (!cart) return { count: 0 }

  return prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  })
}
