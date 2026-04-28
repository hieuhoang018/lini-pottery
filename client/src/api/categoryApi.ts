import type { Category } from "../types/category"
import { apiClient } from "./apiClient"

export const getCategories = async () => {
  const { data } = await apiClient.get<Category[]>("/categories")
  return data
}

export const getCategoryBySlug = async (slug: string) => {
  const { data } = await apiClient.get<Category>(`/categories/${slug}`)
  return data
}
