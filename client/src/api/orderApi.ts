import type { GuestCheckoutInput } from "../types/api-input"
import type { CheckoutAddress, Order } from "../types/order"
import type { GetMyOrdersParams } from "../types/params"
import { apiClient } from "./apiClient"

export const checkoutLoggedInUser = async (input: CheckoutAddress) => {
  const { data } = await apiClient.post("/orders/checkout", input)
  return data
}

export const checkoutGuest = async (input: GuestCheckoutInput) => {
  const { data } = await apiClient.post("/orders/guest-checkout", input)
  return data
}

export const getMyOrders = async (params?: GetMyOrdersParams) => {
  const { data } = await apiClient.get<Order[]>("/orders/my", {
    params,
  })

  return data
}

export const getMyOrderById = async (orderId: string) => {
  const { data } = await apiClient.get<Order>(`/orders/${orderId}`)
  return data
}
