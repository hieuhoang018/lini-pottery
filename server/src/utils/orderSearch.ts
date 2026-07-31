type InsensitiveContains = { contains: string; mode: "insensitive" }

const textCondition = (value: string): InsensitiveContains => ({
  contains: value,
  mode: "insensitive",
})

export function buildOrderAddressAndItemsConditions(search: string) {
  return [
    { orderCode: textCondition(search) },
    { address: { is: { recipientName: textCondition(search) } } },
    { address: { is: { phone: textCondition(search) } } },
    { address: { is: { city: textCondition(search) } } },
    { address: { is: { postalCode: textCondition(search) } } },
    { items: { some: { productName: textCondition(search) } } },
  ]
}
