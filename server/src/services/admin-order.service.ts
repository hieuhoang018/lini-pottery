import { prisma } from "../lib/prisma"
import { OrderStatus, PaymentStatus } from "../types/order"
import { GetAllOrdersForAdminParams } from "../types/params"
import { buildPaginationMeta } from "../utils/pagination"

export const getAllOrdersForAdmin = async ({
  search,
  status,
  paymentStatus,
  page = 1,
  limit = 20,
}: GetAllOrdersForAdminParams = {}) => {
  const trimmedSearch = search?.trim()
  const skip = (page - 1) * limit

  const where = {
    ...(status ? { status } : {}),
    ...(paymentStatus ? { paymentStatus } : {}),

    ...(trimmedSearch
      ? {
          OR: [
            {
              id: {
                equals: trimmedSearch,
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

  const [orders, totalItems] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: true,
        address: true,
        paymentRecords: true,
      },
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
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      items: true,
      address: true,
      paymentRecords: true,
    },
  })
}

export const updateOrderStatusForAdmin = async (
  orderId: string,
  status: OrderStatus,
) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: true,
      address: true,
      paymentRecords: true,
    },
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
      include: {
        items: true,
        address: true,
        paymentRecords: true,
      },
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
      include: {
        items: true,
        address: true,
        paymentRecords: true,
      },
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
