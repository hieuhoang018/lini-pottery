import { Prisma } from "@prisma/client"
import { prisma } from "../lib/prisma"
import { OrderStatus, PaymentStatus } from "../types/order"
import { GetAllOrdersForAdminParams } from "../types/params"
import { buildPaginationMeta } from "../utils/pagination"
import { isValidUuid } from "../utils/isValidUuid"
import { ORDER_INCLUDE } from "./order.service"

const ORDER_INCLUDE_WITH_ADMIN_USER = {
  ...ORDER_INCLUDE,
  user: { select: { id: true, name: true, email: true, phone: true } },
} satisfies Prisma.OrderInclude

export const getAllOrdersForAdmin = async ({
  search,
  status,
  paymentStatus,
  page = 1,
  limit = 20,
}: GetAllOrdersForAdminParams = {}) => {
  const trimmedSearch = search?.trim()
  const searchIsUuid = trimmedSearch ? isValidUuid(trimmedSearch) : false
  const skip = (page - 1) * limit

  const where = {
    ...(status ? { status } : {}),
    ...(paymentStatus ? { paymentStatus } : {}),

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

            {
              orderCode: {
                contains: trimmedSearch,
                mode: "insensitive" as const,
              },
            },

            {
              guestName: {
                contains: trimmedSearch,
                mode: "insensitive" as const,
              },
            },
            {
              guestEmail: {
                contains: trimmedSearch,
                mode: "insensitive" as const,
              },
            },
            {
              guestPhone: {
                contains: trimmedSearch,
                mode: "insensitive" as const,
              },
            },
            {
              user: {
                is: {
                  name: {
                    contains: trimmedSearch,
                    mode: "insensitive" as const,
                  },
                },
              },
            },
            {
              user: {
                is: {
                  email: {
                    contains: trimmedSearch,
                    mode: "insensitive" as const,
                  },
                },
              },
            },
            {
              address: {
                is: {
                  recipientName: {
                    contains: trimmedSearch,
                    mode: "insensitive" as const,
                  },
                },
              },
            },
            {
              address: {
                is: {
                  phone: {
                    contains: trimmedSearch,
                    mode: "insensitive" as const,
                  },
                },
              },
            },
            {
              address: {
                is: {
                  city: {
                    contains: trimmedSearch,
                    mode: "insensitive" as const,
                  },
                },
              },
            },
            {
              address: {
                is: {
                  postalCode: {
                    contains: trimmedSearch,
                    mode: "insensitive" as const,
                  },
                },
              },
            },
            {
              items: {
                some: {
                  productName: {
                    contains: trimmedSearch,
                    mode: "insensitive" as const,
                  },
                },
              },
            },
          ],
        }
      : {}),
  }

  const [orders, totalItems] = await Promise.all([
    prisma.order.findMany({
      where,
      include: ORDER_INCLUDE_WITH_ADMIN_USER,
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

export const getOrderByIdForAdmin = async (orderId: string) => {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: ORDER_INCLUDE_WITH_ADMIN_USER,
  })
}

export const updateOrderStatusForAdmin = async (
  orderId: string,
  status: OrderStatus,
) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: ORDER_INCLUDE,
  })
}

export const updatePaymentStatusForAdmin = async (
  orderId: string,
  paymentStatus: PaymentStatus,
) => {
  return prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { paymentStatus },
    })

    if (paymentStatus === "PAID") {
      await tx.paymentRecord.create({
        data: {
          orderId,
          method: "BANK_QR",
          status: "CONFIRMED",
          paidAt: new Date(),
        },
      })
    }

    if (paymentStatus === "CANCELLED") {
      await tx.paymentRecord.create({
        data: {
          orderId,
          method: "BANK_QR",
          status: "REJECTED",
        },
      })
    }

    return tx.order.findUnique({
      where: { id: orderId },
      include: ORDER_INCLUDE,
    })
  })
}

export const cancelOrderForAdmin = async (orderId: string) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    })

    if (!order) {
      throw new Error("ORDER_NOT_FOUND")
    }

    if (order.status === "CANCELLED") {
      throw new Error("ORDER_ALREADY_CANCELLED")
    }

    for (const item of order.items) {
      if (item.productId) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              increment: item.quantity,
            },
          },
        })
      }
    }

    const cancelledOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        paymentStatus: "CANCELLED",
      },
      include: ORDER_INCLUDE,
    })

    await tx.paymentRecord.create({
      data: {
        orderId,
        method: "BANK_QR",
        status: "REJECTED",
        referenceNote: "Order cancelled by admin",
      },
    })

    return cancelledOrder
  })
}
