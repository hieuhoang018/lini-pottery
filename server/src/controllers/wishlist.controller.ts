import { Response } from "express"
import { AuthRequest } from "../middlewares/auth.middleware"
import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
} from "../services/wishlist.service"
import { asyncHandler } from "../utils/asyncHandler"
import { AppError } from "../utils/AppError"

export const getWishlistHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId

    const wishlist = await getWishlist(userId)

    return res.status(200).json(wishlist)
  },
)

export const addWishlistItemHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId
    const { productId } = req.body

    if (!productId) {
      throw new AppError("productId is required", 400, "PRODUCT_ID_REQUIRED")
    }

    const item = await addWishlistItem(userId, productId)

    return res.status(201).json(item)
  },
)

export const removeWishlistItemHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId
    const { productId } = req.params

    await removeWishlistItem(userId, productId)

    return res.status(200).json({
      message: "Wishlist item removed",
    })
  },
)
