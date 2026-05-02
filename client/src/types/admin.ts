export type AdminOrder = {
  id: string
  userId?: string | null
  guestName?: string | null
  guestEmail?: string | null
  guestPhone?: string | null
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  paymentStatus: "PENDING" | "PAID" | "CANCELLED"
  paymentMethod: "BANK_QR"
  subtotalAmount: string
  shippingFee: string
  totalAmount: string
  notes?: string | null
  createdAt: string
  updatedAt: string

  user?: {
    id: string
    name: string
    email: string
    phone?: string | null
  } | null

  items: {
    id: string
    productName: string
    productPrice: string
    quantity: number
    lineTotal: string
    productImageUrl?: string | null
  }[]

  address?: {
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
