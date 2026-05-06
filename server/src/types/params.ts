import { OrderStatus, PaymentStatus } from "./order"
import { ProductSortOption, StockFilter } from "./product"

export type OrderIdParams = {
  id: string
}

export type ProductIdParams = {
  productId: string
}

export type ProductImageIdParams = {
  id: string
}

export type ProductSlugParams = {
  slug: string
}

export type CategoryParams = {
  slug: string
}

export type GetAllOrdersForAdminParams = {
  search?: string
  status?: OrderStatus
  paymentStatus?: PaymentStatus
}

export type GetProductsParams = {
  categorySlug?: string
  active?: string
  search?: string
  sort?: ProductSortOption
  availableOnly?: boolean
  stock?: StockFilter
}
