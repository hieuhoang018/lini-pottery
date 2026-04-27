import { Request, Response } from "express"
import { AuthRequest } from "../middlewares/auth.middleware"
import {
  checkoutFromCart,
  getMyOrders,
  getOrderByIdForUser,
  guestCheckout,
} from "../services/order.service"

export const checkoutHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId

    const {
      recipientName,
      phone,
      streetAddress,
      city,
      postalCode,
      country,
      additionalInfo,
      notes,
    } = req.body

    if (
      !recipientName ||
      !phone ||
      !streetAddress ||
      !city ||
      !postalCode ||
      !country
    ) {
      return res.status(400).json({
        message:
          "recipientName, phone, streetAddress, city, postalCode, and country are required",
      })
    }

    const order = await checkoutFromCart({
      userId,
      recipientName,
      phone,
      streetAddress,
      city,
      postalCode,
      country,
      additionalInfo,
      notes,
    })

    return res.status(201).json({
      message: "Order placed successfully",
      paymentInstruction: {
        method: "BANK_QR",
        note: "Please scan the QR code or transfer to the provided bank account. Admin will confirm payment manually.",
      },
      order,
    })
  } catch (error: any) {
    if (error.message === "CART_EMPTY") {
      return res.status(400).json({ message: "Cart is empty" })
    }

    if (error.message === "PRODUCT_NOT_AVAILABLE") {
      return res
        .status(400)
        .json({ message: "A product is no longer available" })
    }

    if (error.message === "NOT_ENOUGH_STOCK") {
      return res
        .status(400)
        .json({ message: "Not enough stock for one or more products" })
    }

    console.error("Checkout failed:", error)
    return res.status(500).json({ message: "Checkout failed" })
  }
}

export const getMyOrdersHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId

    const orders = await getMyOrders(userId)

    return res.status(200).json(orders)
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return res.status(500).json({ message: "Failed to fetch orders" })
  }
}

export const getMyOrderByIdHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.userId
    const { id } = req.params

    const order = await getOrderByIdForUser(id, userId)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    return res.status(200).json(order)
  } catch (error) {
    console.error("Failed to fetch order:", error)
    return res.status(500).json({ message: "Failed to fetch order" })
  }
}

export const guestCheckoutHandler = async (req: Request, res: Response) => {
  try {
    const {
      items,
      guestName,
      guestEmail,
      guestPhone,
      recipientName,
      phone,
      streetAddress,
      city,
      postalCode,
      country,
      additionalInfo,
      notes,
    } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items are required" })
    }

    if (!guestName || !guestPhone) {
      return res.status(400).json({
        message: "guestName and guestPhone are required",
      })
    }

    if (
      !recipientName ||
      !phone ||
      !streetAddress ||
      !city ||
      !postalCode ||
      !country
    ) {
      return res.status(400).json({
        message:
          "recipientName, phone, streetAddress, city, postalCode, and country are required",
      })
    }

    const normalizedItems = items.map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
    }))

    // check if uuid is invalid
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    const hasInvalidProductId = normalizedItems.some(
      (item) => !uuidRegex.test(item.productId),
    )

    if (hasInvalidProductId) {
      return res.status(400).json({
        message: "One or more productId values are invalid",
      })
    }

    const order = await guestCheckout({
      items: normalizedItems,
      guestName,
      guestEmail,
      guestPhone,
      recipientName,
      phone,
      streetAddress,
      city,
      postalCode,
      country,
      additionalInfo,
      notes,
    })

    return res.status(201).json({
      message: "Guest order placed successfully",
      paymentInstruction: {
        method: "BANK_QR",
        note: "Please scan the QR code or transfer to the provided bank account. Admin will confirm payment manually.",
      },
      order,
    })
  } catch (error: any) {
    if (error.message === "CART_EMPTY") {
      return res.status(400).json({ message: "Cart is empty" })
    }

    if (error.message === "PRODUCT_NOT_AVAILABLE") {
      return res
        .status(400)
        .json({ message: "A product is no longer available" })
    }

    if (error.message === "INVALID_QUANTITY") {
      return res.status(400).json({ message: "Invalid quantity" })
    }

    if (error.message === "NOT_ENOUGH_STOCK") {
      return res
        .status(400)
        .json({ message: "Not enough stock for one or more products" })
    }

    console.error("Guest checkout failed:", error)
    return res.status(500).json({ message: "Guest checkout failed" })
  }
}
