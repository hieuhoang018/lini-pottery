export function getStatusBadgeClass(status: string) {
  if (status === "DELIVERED" || status === "PAID") {
    return "bg-green-50 text-green-700"
  }

  if (status === "CANCELLED") {
    return "bg-red-50 text-red-700"
  }

  if (status === "SHIPPED" || status === "CONFIRMED") {
    return "bg-blue-50 text-blue-700"
  }

  return "bg-amber-50 text-amber-700"
}

export function getPaymentRecordStatusBadgeClass(status: string) {
  if (status === "CONFIRMED") {
    return "bg-green-50 text-green-700"
  }

  if (status === "REJECTED") {
    return "bg-red-50 text-red-700"
  }

  return "bg-amber-50 text-amber-700"
}
