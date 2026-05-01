import type { CreateProductImageInput, ProductImage } from "../types/product"
import { apiClient } from "./apiClient"

export const getProductImages = async (productId: string) => {
  const response = await apiClient.get<ProductImage[]>(
    `/products/${productId}/images`,
  )

  return response.data
}

export const createProductImage = async (
  productId: string,
  input: CreateProductImageInput,
) => {
  const response = await apiClient.post<ProductImage>(
    `/products/${productId}/images`,
    input,
  )

  return response.data
}

export const deleteProductImage = async (imageId: string) => {
  const response = await apiClient.delete(`/product-images/${imageId}`)
  return response.data
}
