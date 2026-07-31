import { Request, Response } from "express"
import { AuthRequest } from "../types/auth"
import {
  checkoutFromCart,
  getMyOrders,
  getOrderByIdForUser,
  guestCheckout,
} from "../services/order.service"
import { asyncHandler } from "../utils/asyncHandler"
import { AppError } from "../utils/AppError"
import { MyOrdersQuery } from "../types/query"
import { getPaginationParams } from "../utils/pagination"

export const checkoutHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
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
      throw new AppError(
        "recipientName, phone, streetAddress, city, postalCode, and country are required",
        400,
        "CHECKOUT_REQUIRED_FIELDS_MISSING",
      )
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
  },
)

export const getMyOrdersHandler = asyncHandler(
  async (
    req: AuthRequest & Request<{}, {}, {}, MyOrdersQuery>,
    res: Response,
  ) => {
    const userId = req.user!.userId
    const search = req.query.search

    const { page, limit } = getPaginationParams(req.query)

    const result = await getMyOrders({
      userId,
      search,
      page,
      limit,
    })

    return res.status(200).json(result)
  },
)

export const getMyOrderByIdHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId
    const id = req.params.id

    if (!id || Array.isArray(id)) {
      throw new AppError("Order id is required", 400, "ORDER_ID_REQUIRED")
    }

    const order = await getOrderByIdForUser(id, userId)

    if (!order) {
      throw new AppError("Order not found", 404, "ORDER_NOT_FOUND")
    }

    return res.status(200).json(order)
  },
)

export const guestCheckoutHandler = asyncHandler(
  async (req: Request, res: Response) => {
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
      throw new AppError("items are required", 400, "ITEMS_REQUIRED")
    }

    if (!guestName || !guestPhone) {
      throw new AppError(
        "guestName and guestPhone are required",
        400,
        "GUEST_REQUIRED_FIELDS_MISSING",
      )
    }

    if (
      !recipientName ||
      !phone ||
      !streetAddress ||
      !city ||
      !postalCode ||
      !country
    ) {
      throw new AppError(
        "recipientName, phone, streetAddress, city, postalCode, and country are required",
        400,
        "CHECKOUT_REQUIRED_FIELDS_MISSING",
      )
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
      throw new AppError(
        "One or more productId values are invalid",
        400,
        "INVALID_PRODUCT_ID",
      )
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
  },
)
