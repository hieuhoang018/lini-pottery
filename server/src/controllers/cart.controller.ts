import { Response } from "express"
import { AuthRequest } from "../middlewares/auth.middleware"
import {
  addItemToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../services/cart.service"

export const getCartHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId
    const cart = await getCart(userId)

    return res.status(200).json(cart)
  } catch (error) {
    console.error("Failed to fetch cart:", error)
    return res.status(500).json({ message: "Failed to fetch cart" })
  }
}

export const addCartItemHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId
    const { productId, quantity } = req.body

    if (!productId) {
      return res.status(400).json({ message: "productId is required" })
    }

    const numericQuantity = quantity !== undefined ? Number(quantity) : 1

    if (
      Number.isNaN(numericQuantity) ||
      numericQuantity <= 0 ||
      !Number.isInteger(numericQuantity)
    ) {
      return res.status(400).json({
        message: "quantity must be a positive integer",
      })
    }

    const item = await addItemToCart(userId, productId, numericQuantity)

    return res.status(201).json(item)
  } catch (error: any) {
    if (error.message === "PRODUCT_NOT_AVAILABLE") {
      return res.status(400).json({ message: "Product is not available" })
    }

    if (error.message === "NOT_ENOUGH_STOCK") {
      return res.status(400).json({ message: "Not enough stock" })
    }

    console.error("Failed to add cart item:", error)
    return res.status(500).json({ message: "Failed to add cart item" })
  }
}

export const updateCartItemHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.userId
    const { itemId } = req.params
    const { quantity } = req.body

    if (quantity === undefined) {
      return res.status(400).json({ message: "quantity is required" })
    }

    const numericQuantity = Number(quantity)

    if (Number.isNaN(numericQuantity) || !Number.isInteger(numericQuantity)) {
      return res.status(400).json({
        message: "quantity must be an integer",
      })
    }

    const item = await updateCartItemQuantity(itemId, userId, numericQuantity)

    return res.status(200).json(item)
  } catch (error: any) {
    if (error.message === "CART_ITEM_NOT_FOUND") {
      return res.status(404).json({ message: "Cart item not found" })
    }

    if (error.message === "NOT_ENOUGH_STOCK") {
      return res.status(400).json({ message: "Not enough stock" })
    }

    console.error("Failed to update cart item:", error)
    return res.status(500).json({ message: "Failed to update cart item" })
  }
}

export const removeCartItemHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.userId
    const { itemId } = req.params

    await removeCartItem(itemId, userId)

    return res.status(200).json({ message: "Cart item removed" })
  } catch (error: any) {
    if (error.message === "CART_ITEM_NOT_FOUND") {
      return res.status(404).json({ message: "Cart item not found" })
    }

    console.error("Failed to remove cart item:", error)
    return res.status(500).json({ message: "Failed to remove cart item" })
  }
}

export const clearCartHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId

    await clearCart(userId)

    return res.status(200).json({ message: "Cart cleared" })
  } catch (error) {
    console.error("Failed to clear cart:", error)
    return res.status(500).json({ message: "Failed to clear cart" })
  }
}
