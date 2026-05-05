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

export type GetProductsParams = {
  search?: string
  category?: string
  active?: ActiveFilter
  sort?: SortOption
  availableOnly?: boolean
  stock?: StockFilter
}

export type SortOption = "newest" | "price_asc" | "price_desc"
export type ActiveFilter = "all" | "active" | "inactive"
export type StockFilter = "all" | "in_stock" | "out_of_stock"
