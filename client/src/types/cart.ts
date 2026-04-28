import type { Product } from "./product"

export type CartItem = {
  id: string
  cartId: string
  productId: string
  quantity: number
  product: Product
  createdAt: string
  updatedAt: string
}

export type Cart = {
  id: string
  userId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}
