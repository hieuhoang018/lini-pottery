import type { CheckoutAddress } from "./order"

export type GuestCheckoutInput = CheckoutAddress & {
  guestName: string
  guestEmail?: string
  guestPhone: string
  items: {
    productId: string
    quantity: number
  }[]
}

export type RegisterFormInput = {
  name: string
  email: string
  password: string
  phone: string
}

export type UpdateProfileFormInput = {
  name: string
  phone: string
}
