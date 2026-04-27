import { prisma } from "../lib/prisma"

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"

type PaymentStatus = "PENDING" | "PAID" | "CANCELLED"

export const getAllOrdersForAdmin = async () => {
  return prisma.order.findMany({
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
  })
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
