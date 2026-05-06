import type { CheckoutAddress } from "./order"

export type GuestCheckoutInput = CheckoutAddress & {
  guestName: string
  guestEmail?: string
  guestPhone: string
  items: {
    productId: string
    quantity: number
  }[]
}

export type CreateProductImageInput = {
  imageUrl: string
  altText?: string
  sortOrder?: number
}

export type UpdateProductInput = Partial<CreateProductInput> & {
  isActive?: boolean
}

export type CreateProductInput = {
  name: string
  slug: string
  description: string
  price: number
  stockQuantity?: number
  categoryId: string
  material?: string
  color?: string
  dimensionsText?: string
  weightText?: string
  careInstructions?: string
  featuredImageUrl?: string
}

export type RegisterFormInput = {
  name: string
  email: string
  password: string
  phone: string
}
