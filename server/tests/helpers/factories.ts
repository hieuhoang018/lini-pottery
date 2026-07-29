import { prisma } from "../../src/lib/prisma"

let counter = 0
const unique = (prefix: string) => `${prefix}-${Date.now()}-${counter++}`

export const createCategory = async (overrides: Partial<{ name: string }> = {}) => {
  const name = overrides.name ?? "Vases"

  return prisma.category.create({
    data: { name, slug: unique("vases") },
  })
}

export const createProduct = async (
  categoryId: string,
  overrides: Partial<{
    name: string
    price: number
    stockQuantity: number
    isActive: boolean
  }> = {},
) => {
  return prisma.product.create({
    data: {
      name: overrides.name ?? "Ceramic Vase",
      slug: unique("ceramic-vase"),
      description: "A handmade ceramic vase",
      price: overrides.price ?? 100,
      stockQuantity: overrides.stockQuantity ?? 10,
      isActive: overrides.isActive ?? true,
      categoryId,
    },
  })
}
