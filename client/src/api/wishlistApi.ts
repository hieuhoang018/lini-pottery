import type { GetWishlistParams } from "../types/params"
import type { WishlistItem } from "../types/wishlist"
import { apiClient } from "./apiClient"

export const getWishlist = async (params?: GetWishlistParams) => {
  const response = await apiClient.get("/wishlist", { params })
  return response.data
}

export const addWishlistItem = async (productId: string) => {
  const response = await apiClient.post<WishlistItem>("/wishlist/items", {
    productId,
  })

  return response.data
}

export const removeWishlistItem = async (productId: string) => {
  const response = await apiClient.delete(`/wishlist/items/${productId}`)
  return response.data
}
