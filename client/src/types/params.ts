export type RegisterParams = {
  name: string
  email: string
  password: string
  phone?: string
}

export type LoginParams = { email: string; password: string }

export type GetMyOrdersParams = {
  search?: string
  page?: number
  limit?: number
}

export type GetProductsParams = {
  search?: string
  category?: string
  sort?: SortOption
  availableOnly?: boolean
  stock?: StockFilter
  page?: number
  limit?: number
}

export type SortOption = "newest" | "price_asc" | "price_desc"
export type StockFilter = "all" | "in_stock" | "out_of_stock"

export type GetWishlistParams = {
  search?: string
  page?: number
  limit?: number
}

export type UpdateProfileParams = {
  name?: string
  phone?: string
}

export type ChangePasswordParams = {
  currentPassword: string
  newPassword: string
}

export type RequestEmailChangeParams = {
  newEmail: string
  currentPassword: string
}
