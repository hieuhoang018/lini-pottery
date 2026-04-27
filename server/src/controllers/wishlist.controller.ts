import { Response } from "express"
import { AuthRequest } from "../middlewares/auth.middleware"
import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
} from "../services/wishlist.service"

export const getWishlistHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId

    const wishlist = await getWishlist(userId)

    return res.status(200).json(wishlist)
  } catch (error) {
    console.error("Failed to fetch wishlist:", error)
    return res.status(500).json({ message: "Failed to fetch wishlist" })
  }
}

export const addWishlistItemHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.userId
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({ message: "productId is required" })
    }

    const item = await addWishlistItem(userId, productId)

    return res.status(201).json(item)
  } catch (error: any) {
    if (error.message === "PRODUCT_NOT_AVAILABLE") {
      return res.status(400).json({ message: "Product is not available" })
    }

    console.error("Failed to add wishlist item:", error)
    return res.status(500).json({ message: "Failed to add wishlist item" })
  }
}

export const removeWishlistItemHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.userId
    const { productId } = req.params

    await removeWishlistItem(userId, productId)

    return res.status(200).json({ message: "Wishlist item removed" })
  } catch (error: any) {
    if (error.message === "WISHLIST_ITEM_NOT_FOUND") {
      return res.status(404).json({ message: "Wishlist item not found" })
    }

    console.error("Failed to remove wishlist item:", error)
    return res.status(500).json({ message: "Failed to remove wishlist item" })
  }
}
