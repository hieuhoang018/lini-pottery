import type { User } from "../types/auth"
import type {
  ChangePasswordParams,
  RequestEmailChangeParams,
  UpdateProfileParams,
} from "../types/params"
import { apiClient } from "./apiClient"

export const updateProfile = async (params: UpdateProfileParams) => {
  const { data } = await apiClient.patch<User>("/users/me", params)
  return data
}

export const changePassword = async (params: ChangePasswordParams) => {
  const { data } = await apiClient.post<{ message: string }>(
    "/users/me/password",
    params,
  )
  return data
}

export const requestEmailChange = async (params: RequestEmailChangeParams) => {
  const { data } = await apiClient.post<User>("/users/me/email-change", params)
  return data
}

export const confirmEmailChange = async (token: string) => {
  const { data } = await apiClient.post<User>(
    "/users/me/email-change/confirm",
    { token },
  )
  return data
}
