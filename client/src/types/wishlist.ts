import type { Product } from "./product"

export type WishlistItem = {
  id: string
  userId: string
  productId: string
  product: Product
  createdAt: string
}
