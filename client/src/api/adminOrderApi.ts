import type { AdminOrder } from "../types/admin"
import { apiClient } from "./apiClient"

export const getAdminOrders = async () => {
  const response = await apiClient.get<AdminOrder[]>("/admin/orders")
  return response.data
}

export const getAdminOrderById = async (orderId: string) => {
  const response = await apiClient.get<AdminOrder>(`/admin/orders/${orderId}`)
  return response.data
}

export const updateAdminOrderStatus = async (
  orderId: string,
  status: AdminOrder["status"],
) => {
  const response = await apiClient.patch<AdminOrder>(
    `/admin/orders/${orderId}/status`,
    { status },
  )

  return response.data
}

export const updateAdminPaymentStatus = async (
  orderId: string,
  paymentStatus: AdminOrder["paymentStatus"],
) => {
  const response = await apiClient.patch<AdminOrder>(
    `/admin/orders/${orderId}/payment`,
    { paymentStatus },
  )

  return response.data
}

export const cancelAdminOrder = async (orderId: string) => {
  const response = await apiClient.patch<AdminOrder>(
    `/admin/orders/${orderId}/cancel`,
  )

  return response.data
}
