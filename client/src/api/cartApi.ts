import type { Cart, CartItem } from "../types/cart"
import { apiClient } from "./apiClient"

export const getCart = async () => {
  const { data } = await apiClient.get<Cart>("/cart")
  return data
}

export const addCartItem = async (productId: string, quantity = 1) => {
  const { data } = await apiClient.post<CartItem>("/cart/items", {
    productId,
    quantity,
  })

  return data
}

export const updateCartItem = async (itemId: string, quantity: number) => {
  const { data } = await apiClient.patch<CartItem>(`/cart/items/${itemId}`, {
    quantity,
  })

  return data
}

export const removeCartItem = async (itemId: string) => {
  const { data } = await apiClient.delete(`/cart/items/${itemId}`)
  return data
}

export const clearCart = async () => {
  const { data } = await apiClient.delete("/cart")
  return data
}
