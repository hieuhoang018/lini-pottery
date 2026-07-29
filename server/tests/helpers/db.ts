import { prisma } from "../../src/lib/prisma"

const TABLES = [
  "cart_items",
  "carts",
  "wishlist_items",
  "payment_records",
  "order_addresses",
  "order_items",
  "orders",
  "product_images",
  "products",
  "categories",
  "users",
  "counters",
]

export const resetDb = async () => {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${TABLES.map((t) => `"${t}"`).join(", ")} RESTART IDENTITY CASCADE`,
  )
}
