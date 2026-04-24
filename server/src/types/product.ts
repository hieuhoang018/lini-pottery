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
}

export type UpdateProductInput = Partial<CreateProductInput>
