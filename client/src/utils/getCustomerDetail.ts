import type { AdminOrder } from "../types/admin"

export function getCustomerName(order: AdminOrder) {
  return order.user?.name || order.guestName || "Khách hàng"
}

export function getCustomerEmail(order: AdminOrder) {
  return order.user?.email || order.guestEmail || "Không có email"
}

export function getCustomerPhone(order: AdminOrder) {
  return order.user?.phone || order.guestPhone || "Không có số điện thoại"
}
