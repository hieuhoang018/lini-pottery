export type CheckoutAddress = {
  recipientName: string
  phone: string
  streetAddress: string
  city: string
  postalCode: string
  country: string
  additionalInfo?: string
  notes?: string
}

export type GuestCheckoutInput = CheckoutAddress & {
  guestName: string
  guestEmail?: string
  guestPhone: string
  items: {
    productId: string
    quantity: number
  }[]
}

export type CustomerOrder = {
  id: string
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  paymentStatus: "PENDING" | "PAID" | "CANCELLED"
  paymentMethod: "BANK_QR"
  subtotalAmount: string
  shippingFee: string
  totalAmount: string
  notes?: string | null
  createdAt: string
  updatedAt: string

  items: {
    id: string
    productId?: string | null
    productName: string
    productPrice: string
    quantity: number
    lineTotal: string
    productImageUrl?: string | null
    createdAt: string
  }[]

  address?: {
    id: string
    recipientName: string
    phone: string
    streetAddress: string
    city: string
    postalCode: string
    country: string
    additionalInfo?: string | null
  } | null

  paymentRecords?: {
    id: string
    method: "BANK_QR"
    status: "PENDING" | "CONFIRMED" | "REJECTED"
    referenceNote?: string | null
    paidAt?: string | null
    createdAt: string
    updatedAt: string
  }[]
}
