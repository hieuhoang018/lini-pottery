import type { User } from "../types/auth"
import type { LoginParams, RegisterParams } from "../types/params"
import type { AuthResponse } from "../types/response"
import { apiClient } from "./apiClient"

export const register = async (params: RegisterParams) => {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", params)
  return data
}

export const login = async (params: LoginParams) => {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", params)
  return data
}

export const refreshToken = async () => {
  const { data } = await apiClient.post<AuthResponse>("/auth/refresh")
  return data
}

export const logoutApi = async () => {
  const { data } = await apiClient.post<{ message: string }>("/auth/logout")
  return data
}

export const getCurrentUser = async () => {
  const response = await apiClient.get<User>("/auth/me")
  return response.data
}
