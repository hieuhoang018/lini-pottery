export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"

export type PaymentStatus = "PENDING" | "PAID" | "CANCELLED"

export type PaymentMethod = "BANK_QR"

export type PaymentRecordStatus = "PENDING" | "CONFIRMED" | "REJECTED"

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

export type AddressCardAddress = {
  recipientName: string
  phone: string
  streetAddress: string
  city: string
  postalCode: string
  country: string
  additionalInfo?: string | null
}

export type Order = {
  id: string
  userId?: string | null
  user?: OrderUser | null
  guestName?: string | null
  guestEmail?: string | null
  guestPhone?: string | null
  orderCode: number

  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod

  subtotalAmount: string
  shippingFee: string
  totalAmount: string
  notes?: string | null

  createdAt: string
  updatedAt: string

  items: OrderItem[]
  address: CheckoutAddress | null
  paymentRecords: PaymentRecord[]
}

export type OrderItem = {
  id: string
  orderId: string
  productId?: string | null
  productName: string
  productPrice: string
  quantity: number
  lineTotal: string
  productImageUrl?: string | null
  createdAt: string
}

export type PaymentRecord = {
  id: string
  orderId: string
  method: PaymentMethod
  status: PaymentRecordStatus
  referenceNote?: string | null
  paidAt?: string | null
  createdAt: string
  updatedAt: string
}

export type OrderSuccessState = {
  order?: {
    id: string
    totalAmount: string
    paymentStatus: PaymentStatus | string
    status: OrderStatus | string
    items?: {
      id: string
      productName: string
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
    } | null
  }
  paymentInstruction?: {
    method: PaymentMethod | string
    note: string
  }
}

export type OrderUser = {
  id: string
  name: string
  email: string
  phone?: string | null
}

export type CheckoutFormData = {
  guestName: string
  guestEmail: string
  guestPhone: string
  recipientName: string
  phone: string
  streetAddress: string
  city: string
  postalCode: string
  country: string
  additionalInfo: string
  notes: string
}
