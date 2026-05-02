import type { Category } from "./category"

export type ProductImage = {
  id: string
  productId: string
  imageUrl: string
  altText?: string | null
  sortOrder: number
  createdAt: string
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: string
  stockQuantity: number
  isActive: boolean
  categoryId: string
  material?: string | null
  color?: string | null
  dimensionsText?: string | null
  weightText?: string | null
  careInstructions?: string | null
  featuredImageUrl?: string | null
  createdAt: string
  updatedAt: string
  category: Category
  images: ProductImage[]
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

export type CreateProductImageInput = {
  imageUrl: string
  altText?: string
  sortOrder?: number
}

export type UpdateProductInput = Partial<CreateProductInput> & {
  isActive?: boolean
}

export type GetProductsParams = {
  search?: string
  category?: string
  sort?: "newest" | "price_asc" | "price_desc"
  availableOnly?: boolean
}
