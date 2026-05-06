export type ProductQuery = {
  category?: string
  active?: "all" | "active" | "inactive"
  search?: string

  sort?: "newest" | "price_asc" | "price_desc"
  availableOnly?: string
  stock?: "all" | "in_stock" | "out_of_stock"
}

export type MyOrdersQuery = {
  search?: string
}

export type AdminOrdersQuery = {
  search?: string
  status?: string
  paymentStatus?: string
}
