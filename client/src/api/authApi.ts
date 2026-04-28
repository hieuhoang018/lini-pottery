import type { LoginResponse, User } from "../types/auth"
import { apiClient } from "./apiClient"

export const register = async (data: {
  name: string
  email: string
  password: string
  phone?: string
}) => {
  const response = await apiClient.post<User>("/auth/register", data)
  return response.data
}

export const login = async (data: { email: string; password: string }) => {
  const response = await apiClient.post<LoginResponse>("/auth/login", data)
  return response.data
}

export const getCurrentUser = async () => {
  const response = await apiClient.get<User>("/auth/me")
  return response.data
}
