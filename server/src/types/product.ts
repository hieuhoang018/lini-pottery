export type CreateProductInput = {
  name: string
  slug: string
  description: string
  price: number
  stockQuantity?: number
  isActive?: boolean
  categoryId: string
  material?: string
  color?: string
  dimensionsText?: string
  weightText?: string
  careInstructions?: string
  featuredImageUrl?: string
  featuredImagePublicId?: string
}

export type UpdateProductInput = Partial<CreateProductInput>

export type ProductSortOption = "newest" | "price_asc" | "price_desc"

export type StockFilter = "all" | "in_stock" | "out_of_stock"
