import { Request, Response } from "express"
import {
  cancelOrderForAdmin,
  getAllOrdersForAdmin,
  getOrderByIdForAdmin,
  updateOrderStatusForAdmin,
  updatePaymentStatusForAdmin,
} from "../services/admin-order.service"

type OrderIdParams = {
  id: string
}

const allowedOrderStatuses = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]

const allowedPaymentStatuses = ["PENDING", "PAID", "CANCELLED"]

export const getAdminOrdersHandler = async (_req: Request, res: Response) => {
  try {
    const orders = await getAllOrdersForAdmin()
    return res.status(200).json(orders)
  } catch (error) {
    console.error("Failed to fetch admin orders:", error)
    return res.status(500).json({ message: "Failed to fetch orders" })
  }
}

export const getAdminOrderByIdHandler = async (
  req: Request<OrderIdParams>,
  res: Response,
) => {
  try {
    const { id } = req.params

    const order = await getOrderByIdForAdmin(id)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    return res.status(200).json(order)
  } catch (error) {
    console.error("Failed to fetch admin order:", error)
    return res.status(500).json({ message: "Failed to fetch order" })
  }
}

export const updateAdminOrderStatusHandler = async (
  req: Request<OrderIdParams>,
  res: Response,
) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!allowedOrderStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Allowed values: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED",
      })
    }

    const order = await updateOrderStatusForAdmin(id, status)

    return res.status(200).json(order)
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Order not found" })
    }

    console.error("Failed to update order status:", error)
    return res.status(500).json({ message: "Failed to update order status" })
  }
}

export const updateAdminPaymentStatusHandler = async (
  req: Request<OrderIdParams>,
  res: Response,
) => {
  try {
    const { id } = req.params
    const { paymentStatus } = req.body

    if (!allowedPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        message:
          "Invalid paymentStatus. Allowed values: PENDING, PAID, CANCELLED",
      })
    }

    const order = await updatePaymentStatusForAdmin(id, paymentStatus)

    return res.status(200).json(order)
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Order not found" })
    }

    console.error("Failed to update payment status:", error)
    return res.status(500).json({ message: "Failed to update payment status" })
  }
}

export const cancelAdminOrderHandler = async (
  req: Request<OrderIdParams>,
  res: Response,
) => {
  try {
    const { id } = req.params

    const order = await cancelOrderForAdmin(id)

    return res.status(200).json(order)
  } catch (error: any) {
    if (error.message === "ORDER_NOT_FOUND") {
      return res.status(404).json({ message: "Order not found" })
    }

    if (error.message === "ORDER_ALREADY_CANCELLED") {
      return res.status(400).json({ message: "Order already cancelled" })
    }

    console.error("Failed to cancel order:", error)
    return res.status(500).json({ message: "Failed to cancel order" })
  }
}
