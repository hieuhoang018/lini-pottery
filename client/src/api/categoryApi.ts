import { apiClient } from "./apiClient"
import type { Category } from "../types/category"
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types/api-input"

export async function getCategories() {
  await new Promise((resolve) => setTimeout(resolve, 5000))
  const response = await apiClient.get<Category[]>("/categories")
  return response.data
}

export async function createCategory(input: CreateCategoryInput) {
  const response = await apiClient.post<Category>("/categories", input)
  return response.data
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const response = await apiClient.patch<Category>(`/categories/${id}`, input)
  return response.data
}

export async function deleteCategory(id: string) {
  await apiClient.delete(`/categories/${id}`)
}
