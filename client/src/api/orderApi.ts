import type { CheckoutAddress, GuestCheckoutInput } from "../types/order"
import { apiClient } from "./apiClient"

export const checkoutLoggedInUser = async (data: CheckoutAddress) => {
  const response = await apiClient.post("/orders/checkout", data)
  return response.data
}

export const checkoutGuest = async (data: GuestCheckoutInput) => {
  const response = await apiClient.post("/orders/guest-checkout", data)
  return response.data
}
