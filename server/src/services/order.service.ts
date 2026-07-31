import { prisma } from "../lib/prisma"
import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client"
import { GetMyOrdersInput } from "../types/order"
import { isValidUuid } from "../utils/isValidUuid"
import { buildPaginationMeta } from "../utils/pagination"
import { buildOrderAddressAndItemsConditions } from "../utils/orderSearch"

export const ORDER_INCLUDE = {
  items: true,
  address: true,
  paymentRecords: true,
} satisfies Prisma.OrderInclude

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
