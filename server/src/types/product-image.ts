export type CreateProductImageInput = {
  productId: string
  imageUrl: string
  publicId?: string
  altText?: string
  sortOrder?: number
}

export type CreateProductImageBody = {
  imageUrl?: string
  publicId?: string
  altText?: string
  sortOrder?: number | string
}
