import { Prisma } from "@prisma/client"
import { prisma } from "../lib/prisma"
import { AppError } from "../utils/AppError"
import { createSlug } from "../utils/createSlug"

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

export const createCategory = async ({
  name,
  slug,
  description,
}: CreateCategoryInput) => {
  const trimmedName = name.trim()
  const finalSlug = slug?.trim() || createSlug(trimmedName)

  if (!finalSlug) {
    throw new AppError("Category slug is invalid", 400, "CATEGORY_SLUG_INVALID")
  }

  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [
        {
          name: {
            equals: trimmedName,
            mode: "insensitive",
          },
        },
        {
          slug: finalSlug,
        },
      ],
    },
  })

  if (existingCategory) {
    throw new AppError(
      "Category already exists",
      409,
      "CATEGORY_ALREADY_EXISTS",
    )
  }

  try {
    return await prisma.category.create({
      data: {
        name: trimmedName,
        slug: finalSlug,
        description: description?.trim() || null,
      },
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        "Category already exists",
        409,
        "CATEGORY_ALREADY_EXISTS",
      )
    }

    throw error
  }
}
