import { Response } from "express"
import { AuthRequest } from "../middlewares/auth.middleware"
import {
  addItemToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../services/cart.service"
import { asyncHandler } from "../utils/asyncHandler"
import { AppError } from "../utils/AppError"

export const getCartHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId

    const cart = await getCart(userId)

    return res.status(200).json(cart)
  },
)

export const addCartItemHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId
    const { productId, quantity } = req.body

    if (!productId) {
      throw new AppError("productId is required", 400, "PRODUCT_ID_REQUIRED")
    }

    const numericQuantity = quantity !== undefined ? Number(quantity) : 1

    if (
      Number.isNaN(numericQuantity) ||
      numericQuantity <= 0 ||
      !Number.isInteger(numericQuantity)
    ) {
      throw new AppError(
        "quantity must be a positive integer",
        400,
        "INVALID_CART_QUANTITY",
      )
    }

    const item = await addItemToCart(userId, productId, numericQuantity)

    return res.status(201).json(item)
  },
)

export const updateCartItemHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId
    const itemId = req.params.itemId
    const { quantity } = req.body

    if (!itemId || Array.isArray(itemId)) {
      throw new AppError("itemId is required", 400, "ITEM_ID_REQUIRED")
    }

    if (quantity === undefined) {
      throw new AppError("quantity is required", 400, "QUANTITY_REQUIRED")
    }

    const numericQuantity = Number(quantity)

    if (Number.isNaN(numericQuantity) || !Number.isInteger(numericQuantity)) {
      throw new AppError(
        "quantity must be an integer",
        400,
        "INVALID_CART_QUANTITY",
      )
    }

    const item = await updateCartItemQuantity(itemId, userId, numericQuantity)

    return res.status(200).json(item)
  },
)

export const removeCartItemHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId
    const itemId = req.params.itemId

    if (!itemId || Array.isArray(itemId)) {
      throw new AppError("itemId is required", 400, "ITEM_ID_REQUIRED")
    }

    await removeCartItem(itemId, userId)

    return res.status(200).json({ message: "Cart item removed" })
  },
)

export const clearCartHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId

    await clearCart(userId)

    return res.status(200).json({ message: "Cart cleared" })
  },
)
