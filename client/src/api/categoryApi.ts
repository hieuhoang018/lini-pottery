import { apiClient } from "./apiClient"
import type { Category } from "../types/category"

export async function getCategories() {
  const response = await apiClient.get<Category[]>("/categories")
  return response.data
}
