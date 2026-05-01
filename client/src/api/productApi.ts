import type { CreateProductInput, Product } from "../types/product"
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

export const getAdminProducts = async () => {
  const { data } = await apiClient.get<Product[]>("/products", {
    params: {
      active: false,
    },
  })

  return data
}

export const getProductById = async (productId: string) => {
  const { data } = await apiClient.get<Product>(`/products/id/${productId}`)
  return data
}

export const createProduct = async (input: CreateProductInput) => {
  const { data } = await apiClient.post<Product>("/products", input)
  return data
}

export const updateProduct = async (
  productId: string,
  input: UpdateProductInput,
) => {
  const { data } = await apiClient.patch<Product>(
    `/products/${productId}`,
    input,
  )
  return data
}

export const updateProductStock = async (
  productId: string,
  stockQuantity: number,
) => {
  const { data } = await apiClient.patch<Product>(
    `/products/${productId}/stock`,
    {
      stockQuantity,
    },
  )

  return data
}

export const updateProductActiveStatus = async (
  productId: string,
  isActive: boolean,
) => {
  const { data } = await apiClient.patch<Product>(
    `/products/${productId}/active`,
    {
      isActive,
    },
  )

  return data
}
