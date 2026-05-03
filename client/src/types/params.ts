export type RegisterParams = {
  name: string
  email: string
  password: string
  phone?: string
}

export type LoginParams = { email: string; password: string }

export type GetAdminOrdersParams = {
  search?: string
  status?: string
  paymentStatus?: string
}

export type GetMyOrdersParams = {
  search?: string
}

export type GetAdminProductsParams = GetProductsParams & {
  active?: boolean
}

export type GetProductsParams = {
  search?: string
  category?: string
  sort?: "newest" | "price_asc" | "price_desc"
  availableOnly?: boolean
}
