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
  page?: number
  limit?: number
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"

export type PaymentStatus = "PENDING" | "PAID" | "CANCELLED"

export type NotificationOrder = {
  orderCode: string
  totalAmount: unknown
  guestName?: string | null
  guestEmail?: string | null
  user: { name: string; email: string } | null
  items: { productName: string; quantity: number; lineTotal: unknown }[]
}
