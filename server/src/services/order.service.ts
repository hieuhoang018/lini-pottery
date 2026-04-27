import { prisma } from "../lib/prisma"
import { CheckoutInput, GuestCheckoutInput } from "../types/order"

export const checkoutFromCart = async (data: CheckoutInput) => {
  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: { userId: data.userId },
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

    if (!cart || cart.items.length === 0) {
      throw new Error("CART_EMPTY")
    }

    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw new Error("PRODUCT_NOT_AVAILABLE")
      }

      if (item.product.stockQuantity < item.quantity) {
        throw new Error("NOT_ENOUGH_STOCK")
      }
    }

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity
    }, 0)

    const shippingFee = 0
    const total = subtotal + shippingFee

    const order = await tx.order.create({
      data: {
        userId: data.userId,
        status: "PENDING",
        paymentStatus: "PENDING",
        paymentMethod: "BANK_QR",
        subtotalAmount: subtotal,
        shippingFee,
        totalAmount: total,
        notes: data.notes,

        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productPrice: item.product.price,
            quantity: item.quantity,
            lineTotal: Number(item.product.price) * item.quantity,
            productImageUrl:
              item.product.featuredImageUrl ||
              item.product.images[0]?.imageUrl ||
              null,
          })),
        },

        address: {
          create: {
            recipientName: data.recipientName,
            phone: data.phone,
            streetAddress: data.streetAddress,
            city: data.city,
            postalCode: data.postalCode,
            country: data.country,
            additionalInfo: data.additionalInfo,
          },
        },

        paymentRecords: {
          create: {
            method: "BANK_QR",
            status: "PENDING",
          },
        },
      },
      include: {
        items: true,
        address: true,
        paymentRecords: true,
      },
    })

    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      })
    }

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    })

    return order
  })
}

export const getMyOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
      address: true,
      paymentRecords: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export const getOrderByIdForUser = async (orderId: string, userId: string) => {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: true,
      address: true,
      paymentRecords: true,
    },
  })
}

export const guestCheckout = async (data: GuestCheckoutInput) => {
  return prisma.$transaction(async (tx) => {
    if (!data.items.length) {
      throw new Error("CART_EMPTY")
    }

    const products = await tx.product.findMany({
      where: {
        id: {
          in: data.items.map((item) => item.productId),
        },
      },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    })

    if (products.length !== data.items.length) {
      throw new Error("PRODUCT_NOT_AVAILABLE")
    }

    const itemsWithProducts = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)

      if (!product || !product.isActive) {
        throw new Error("PRODUCT_NOT_AVAILABLE")
      }

      if (item.quantity <= 0 || !Number.isInteger(item.quantity)) {
        throw new Error("INVALID_QUANTITY")
      }

      if (product.stockQuantity < item.quantity) {
        throw new Error("NOT_ENOUGH_STOCK")
      }

      return {
        ...item,
        product,
      }
    })

    const subtotal = itemsWithProducts.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity
    }, 0)

    const shippingFee = 0
    const total = subtotal + shippingFee

    const order = await tx.order.create({
      data: {
        userId: null,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        status: "PENDING",
        paymentStatus: "PENDING",
        paymentMethod: "BANK_QR",
        subtotalAmount: subtotal,
        shippingFee,
        totalAmount: total,
        notes: data.notes,

        items: {
          create: itemsWithProducts.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productPrice: item.product.price,
            quantity: item.quantity,
            lineTotal: Number(item.product.price) * item.quantity,
            productImageUrl:
              item.product.featuredImageUrl ||
              item.product.images[0]?.imageUrl ||
              null,
          })),
        },

        address: {
          create: {
            recipientName: data.recipientName,
            phone: data.phone,
            streetAddress: data.streetAddress,
            city: data.city,
            postalCode: data.postalCode,
            country: data.country,
            additionalInfo: data.additionalInfo,
          },
        },

        paymentRecords: {
          create: {
            method: "BANK_QR",
            status: "PENDING",
          },
        },
      },
      include: {
        items: true,
        address: true,
        paymentRecords: true,
      },
    })

    for (const item of itemsWithProducts) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      })
    }

    return order
  })
}
