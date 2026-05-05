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

export type CartDisplayItem = {
  product: Product
  quantity: number
}

export type CartContextType = {
  items: CartDisplayItem[]
  loading: boolean
  total: number
  addToCart: (product: Product, quantity?: number) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
}
