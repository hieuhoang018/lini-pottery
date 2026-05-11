export type ProductQuery = PaginationQuery & {
  category?: string
  active?: "all" | "active" | "inactive"
  search?: string

  sort?: "newest" | "price_asc" | "price_desc"
  availableOnly?: string
  stock?: "all" | "in_stock" | "out_of_stock"
}

export type MyOrdersQuery = PaginationQuery & {
  search?: string
}

export type AdminOrdersQuery = PaginationQuery & {
  search?: string
  status?: string
  paymentStatus?: string
}

export type PaginationQuery = {
  page?: string
  limit?: string
}

export type WishlistQuery = {
  search?: string
  page?: string
  limit?: string
}
