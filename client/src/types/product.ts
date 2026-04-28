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
