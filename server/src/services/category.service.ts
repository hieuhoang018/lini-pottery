import { prisma } from "../lib/prisma"

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  })
}

export const getCategoryBySlug = async (slug: string) => {
  return prisma.category.findUnique({
    where: { slug },
  })
}

export const createCategory = async (data: {
  name: string
  slug: string
  description?: string
}) => {
  return prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
    },
  })
}
