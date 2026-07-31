import { prisma } from "../lib/prisma"
import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client"
import {
  CheckoutInput,
  GetMyOrdersInput,
  GuestCheckoutInput,
} from "../types/order"
import { isValidUuid } from "../utils/isValidUuid"
import { buildPaginationMeta } from "../utils/pagination"
import { formatOrderCode } from "../utils/orderCode"
import { buildOrderAddressAndItemsConditions } from "../utils/orderSearch"
import { sendAdminNewOrderNotification } from "./notification.service"

export const ORDER_INCLUDE = {
  items: true,
  address: true,
  paymentRecords: true,
} satisfies Prisma.OrderInclude

export const ORDER_INCLUDE_WITH_USER = {
  ...ORDER_INCLUDE,
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.OrderInclude

export const checkoutFromCart = async (data: CheckoutInput) => {
  const order = await prisma.$transaction(async (tx) => {
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

    const order = await createOrderFromItems(tx, {
      identity: { userId: data.userId },
      items: cart.items,
      address: {
        recipientName: data.recipientName,
        phone: data.phone,
        streetAddress: data.streetAddress,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        additionalInfo: data.additionalInfo,
      },
      notes: data.notes,
    })

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    })

    return order
  })

  await sendAdminNewOrderNotification(order)

  return order
}

export const getMyOrders = async ({
  userId,
  search,
  page = 1,
  limit = 10,
}: GetMyOrdersInput) => {
  const trimmedSearch = search?.trim()
  const searchIsUuid = trimmedSearch ? isValidUuid(trimmedSearch) : false
  const orderStatusSearch = getOrderStatusSearch(trimmedSearch)
  const paymentStatusSearch = getPaymentStatusSearch(trimmedSearch)

  const skip = (page - 1) * limit

  const where = {
    userId,

    ...(trimmedSearch
      ? {
          OR: [
            ...(searchIsUuid
              ? [
                  {
                    id: {
                      equals: trimmedSearch,
                    },
                  },
                ]
              : []),

            ...(orderStatusSearch
              ? [
                  {
                    status: {
                      equals: orderStatusSearch,
                    },
                  },
                ]
              : []),

            ...(paymentStatusSearch
              ? [
                  {
                    paymentStatus: {
                      equals: paymentStatusSearch,
                    },
                  },
                ]
              : []),

            ...buildOrderAddressAndItemsConditions(trimmedSearch),
          ],
        }
      : {}),
  }

  const [orders, totalItems] = await Promise.all([
    prisma.order.findMany({
      where,
      include: ORDER_INCLUDE,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.order.count({
      where,
    }),
  ])

  return {
    data: orders,
    pagination: buildPaginationMeta({
      page,
      limit,
      totalItems,
    }),
  }
}

export const getOrderByIdForUser = async (orderId: string, userId: string) => {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: ORDER_INCLUDE,
  })
}

export const guestCheckout = async (data: GuestCheckoutInput) => {
  const order = await prisma.$transaction(async (tx) => {
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

    const order = await createOrderFromItems(tx, {
      identity: {
        userId: null,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
      },
      items: itemsWithProducts,
      address: {
        recipientName: data.recipientName,
        phone: data.phone,
        streetAddress: data.streetAddress,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        additionalInfo: data.additionalInfo,
      },
      notes: data.notes,
    })

    return order
  })

  await sendAdminNewOrderNotification(order)

  return order
}

const getOrderStatusSearch = (search?: string): OrderStatus | undefined => {
  if (!search) return undefined

  const value = search.toUpperCase()

  if (Object.values(OrderStatus).includes(value as OrderStatus)) {
    return value as OrderStatus
  }

  return undefined
}

const getPaymentStatusSearch = (search?: string): PaymentStatus | undefined => {
  if (!search) return undefined

  const value = search.toUpperCase()

  if (Object.values(PaymentStatus).includes(value as PaymentStatus)) {
    return value as PaymentStatus
  }

  return undefined
}

const getNextOrderCode = async (tx: Prisma.TransactionClient) => {
  const counter = await tx.counter.upsert({
    where: {
      name: "order",
    },
    update: {
      value: {
        increment: 1,
      },
    },
    create: {
      name: "order",
      value: 1,
    },
  })

  return formatOrderCode(counter.value)
}

type OrderIdentity =
  | { userId: string; guestName?: undefined; guestEmail?: undefined; guestPhone?: undefined }
  | { userId: null; guestName: string; guestEmail?: string; guestPhone: string }

type OrderAddressInput = {
  recipientName: string
  phone: string
  streetAddress: string
  city: string
  postalCode: string
  country: string
  additionalInfo?: string
}

type OrderItemWithProduct = {
  productId: string
  quantity: number
  product: {
    name: string
    price: Prisma.Decimal
    featuredImageUrl: string | null
    images: { imageUrl: string }[]
  }
}

const createOrderFromItems = async (
  tx: Prisma.TransactionClient,
  params: {
    identity: OrderIdentity
    items: OrderItemWithProduct[]
    address: OrderAddressInput
    notes?: string
  },
) => {
  const subtotal = params.items.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity
  }, 0)

  const shippingFee = 0
  const total = subtotal + shippingFee
  const orderCode = await getNextOrderCode(tx)

  const order = await tx.order.create({
    data: {
      orderCode,
      ...params.identity,
      status: "PENDING",
      paymentStatus: "PENDING",
      paymentMethod: "BANK_QR",
      subtotalAmount: subtotal,
      shippingFee,
      totalAmount: total,
      notes: params.notes,

      items: {
        create: params.items.map((item) => ({
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
        create: params.address,
      },

      paymentRecords: {
        create: {
          method: "BANK_QR",
          status: "PENDING",
        },
      },
    },
    include: ORDER_INCLUDE_WITH_USER,
  })

  for (const item of params.items) {
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
}
