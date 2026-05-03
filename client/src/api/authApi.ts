import type { User } from "../types/auth"
import type { LoginParams, RegisterParams } from "../types/params"
import type { LoginResponse } from "../types/response"
import { apiClient } from "./apiClient"

export const register = async (params: RegisterParams) => {
  const { data } = await apiClient.post<User>("/auth/register", {
    params,
  })
  return data
}

export const login = async (params: LoginParams) => {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", params)
  return data
}

export const getCurrentUser = async () => {
  const response = await apiClient.get<User>("/auth/me")
  return response.data
}
