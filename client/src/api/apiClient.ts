import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true

      try {
        const response = await apiClient.post("/auth/refresh")

        const newAccessToken = response.data.accessToken

        localStorage.setItem("token", newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return apiClient(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem("token")
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
