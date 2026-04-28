import type { Product } from "../types/product"
import { apiClient } from "./apiClient"

export const getProducts = async (categorySlug?: string) => {
  const { data } = await apiClient.get<Product[]>("/products", {
    params: categorySlug ? { category: categorySlug } : undefined,
  })

  return data
}

export const getProductBySlug = async (slug: string) => {
  const { data } = await apiClient.get<Product>(`/products/slug/${slug}`)
  return data
}
