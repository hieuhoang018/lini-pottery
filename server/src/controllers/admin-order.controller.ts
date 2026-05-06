import { Request, Response } from "express"
import {
  cancelOrderForAdmin,
  getAllOrdersForAdmin,
  getOrderByIdForAdmin,
  updateOrderStatusForAdmin,
  updatePaymentStatusForAdmin,
} from "../services/admin-order.service"
import { asyncHandler } from "../utils/asyncHandler"
import { AppError } from "../utils/AppError"
import { OrderStatus, PaymentStatus } from "../types/order"
import { OrderIdParams } from "../types/params"
import { AdminOrdersQuery } from "../types/query"

const allowedOrderStatuses = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]

const allowedPaymentStatuses = ["PENDING", "PAID", "CANCELLED"]

export const getAdminOrdersHandler = asyncHandler(
  async (req: Request<{}, {}, {}, AdminOrdersQuery>, res: Response) => {
    const search = req.query.search
    const status = req.query.status?.toUpperCase()
    const paymentStatus = req.query.paymentStatus?.toUpperCase()

    if (status && !allowedOrderStatuses.includes(status)) {
      throw new AppError(
        "Invalid status. Allowed values: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED",
        400,
        "INVALID_ORDER_STATUS",
      )
    }

    if (paymentStatus && !allowedPaymentStatuses.includes(paymentStatus)) {
      throw new AppError(
        "Invalid paymentStatus. Allowed values: PENDING, PAID, CANCELLED",
        400,
        "INVALID_PAYMENT_STATUS",
      )
    }

    const orders = await getAllOrdersForAdmin({
      search,
      status: status as OrderStatus | undefined,
      paymentStatus: paymentStatus as PaymentStatus | undefined,
    })

    return res.status(200).json(orders)
  },
)

export const getAdminOrderByIdHandler = asyncHandler(
  async (req: Request<OrderIdParams>, res: Response) => {
    const { id } = req.params

    const order = await getOrderByIdForAdmin(id)

    if (!order) {
      throw new AppError("Order not found", 404, "ORDER_NOT_FOUND")
    }

    return res.status(200).json(order)
  },
)

export const updateAdminOrderStatusHandler = asyncHandler(
  async (req: Request<OrderIdParams>, res: Response) => {
    const { id } = req.params
    const { status } = req.body

    if (!allowedOrderStatuses.includes(status)) {
      throw new AppError(
        "Invalid status. Allowed values: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED",
        400,
        "INVALID_ORDER_STATUS",
      )
    }

    const order = await updateOrderStatusForAdmin(id, status)

    return res.status(200).json(order)
  },
)

export const updateAdminPaymentStatusHandler = asyncHandler(
  async (req: Request<OrderIdParams>, res: Response) => {
    const { id } = req.params
    const { paymentStatus } = req.body

    if (!allowedPaymentStatuses.includes(paymentStatus)) {
      throw new AppError(
        "Invalid paymentStatus. Allowed values: PENDING, PAID, CANCELLED",
        400,
        "INVALID_PAYMENT_STATUS",
      )
    }

    const order = await updatePaymentStatusForAdmin(id, paymentStatus)

    return res.status(200).json(order)
  },
)

export const cancelAdminOrderHandler = asyncHandler(
  async (req: Request<OrderIdParams>, res: Response) => {
    const { id } = req.params

    const order = await cancelOrderForAdmin(id)

    return res.status(200).json(order)
  },
)
