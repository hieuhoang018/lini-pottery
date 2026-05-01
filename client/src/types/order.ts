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
