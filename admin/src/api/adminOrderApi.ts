import type { AdminOrder } from "../types/admin"
import type { GetAdminOrdersParams } from "../types/params"
import { apiClient } from "./apiClient"

export const getAdminOrders = async (params?: GetAdminOrdersParams) => {
  const { data } = await apiClient.get<AdminOrder[]>("/admin/orders", {
    params,
  })

  return data
}

export const getAdminOrderById = async (orderId: string) => {
  const { data } = await apiClient.get<AdminOrder>(`/admin/orders/${orderId}`)
  return data
}

export const updateAdminOrderStatus = async (
  orderId: string,
  status: AdminOrder["status"],
) => {
  const { data } = await apiClient.patch<AdminOrder>(
    `/admin/orders/${orderId}/status`,
    {
      status,
    },
  )

  return data
}

export const updateAdminPaymentStatus = async (
  orderId: string,
  paymentStatus: AdminOrder["paymentStatus"],
) => {
  const { data } = await apiClient.patch<AdminOrder>(
    `/admin/orders/${orderId}/payment`,
    {
      paymentStatus,
    },
  )

  return data
}

export const cancelAdminOrder = async (orderId: string) => {
  const { data } = await apiClient.patch<AdminOrder>(
    `/admin/orders/${orderId}/cancel`,
  )

  return data
}
