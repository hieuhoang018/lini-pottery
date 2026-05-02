export type CheckoutInput = {
  userId: string
  recipientName: string
  phone: string
  streetAddress: string
  city: string
  postalCode: string
  country: string
  additionalInfo?: string
  notes?: string
}

export type GuestCheckoutItem = {
  productId: string
  quantity: number
}

export type GuestCheckoutInput = {
  items: GuestCheckoutItem[]
  guestName: string
  guestEmail?: string
  guestPhone: string
  recipientName: string
  phone: string
  streetAddress: string
  city: string
  postalCode: string
  country: string
  additionalInfo?: string
  notes?: string
}

export type GetMyOrdersInput = {
  userId: string
  search?: string
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"

export type PaymentStatus = "PENDING" | "PAID" | "CANCELLED"
