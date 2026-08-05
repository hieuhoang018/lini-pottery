import type { GetProductsParams } from "../types/params"
import type { Product } from "../types/product"
import { apiClient } from "./apiClient"

export const getProducts = async (params?: GetProductsParams) => {
  const { data } = await apiClient.get<Product[]>("/products", {
    params,
  })

  return data
}

export const getProductBySlug = async (slug: string) => {
  const { data } = await apiClient.get<Product>(`/products/slug/${slug}`)
  return data
}
