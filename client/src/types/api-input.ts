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
  publicId?: string
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
  featuredImagePublicId?: string
}

export type RegisterFormInput = {
  name: string
  email: string
  password: string
  phone: string
}

export type CreateCategoryInput = {
  name: string
  slug?: string
  description?: string
}

export type UpdateCategoryInput = {
  name?: string
  slug?: string
  description?: string
}
