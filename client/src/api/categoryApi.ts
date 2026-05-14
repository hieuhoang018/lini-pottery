import type { CreateCategoryInput } from "../types/api-input"
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

export async function createCategory(input: CreateCategoryInput) {
  const response = await apiClient.post<Category>("/categories", input)
  return response.data
}