import type {
  CheckoutAddress,
  CustomerOrder,
  GuestCheckoutInput,
} from "../types/order"
import { apiClient } from "./apiClient"

type GetMyOrdersParams = {
  search?: string
}

export const checkoutLoggedInUser = async (input: CheckoutAddress) => {
  const { data } = await apiClient.post("/orders/checkout", input)
  return data
}

export const checkoutGuest = async (input: GuestCheckoutInput) => {
  const { data } = await apiClient.post("/orders/guest-checkout", input)
  return data
}

export const getMyOrders = async (params?: GetMyOrdersParams) => {
  const { data } = await apiClient.get<CustomerOrder[]>("/orders/my", {
    params,
  })

  return data
}

export const getMyOrderById = async (orderId: string) => {
  const { data } = await apiClient.get<CustomerOrder>(`/orders/${orderId}`)
  return data
}
