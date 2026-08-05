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
