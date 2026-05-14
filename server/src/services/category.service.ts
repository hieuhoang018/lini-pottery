import { Prisma } from "@prisma/client"
import { prisma } from "../lib/prisma"
import { AppError } from "../utils/AppError"
import { createSlug } from "../utils/createSlug"
import { CreateCategoryInput, UpdateCategoryInput } from "../types/category"
import { buildProductSearchText } from "../utils/search"

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

export const updateCategory = async ({
  id,
  name,
  slug,
  description,
}: UpdateCategoryInput) => {
  const category = await prisma.category.findUnique({
    where: { id },
  })

  if (!category) {
    throw new AppError("Category not found", 404, "CATEGORY_NOT_FOUND")
  }

  const trimmedName = name?.trim()
  const finalName = trimmedName || category.name

  const finalSlug = slug?.trim()
    ? createSlug(slug)
    : trimmedName
      ? createSlug(trimmedName)
      : category.slug

  if (!finalSlug) {
    throw new AppError("Category slug is invalid", 400, "CATEGORY_SLUG_INVALID")
  }

  const existingCategory = await prisma.category.findFirst({
    where: {
      id: {
        not: id,
      },
      OR: [
        {
          name: {
            equals: finalName,
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
      "Another category with this name or slug already exists",
      409,
      "CATEGORY_ALREADY_EXISTS",
    )
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const updatedCategory = await tx.category.update({
        where: { id },
        data: {
          name: finalName,
          slug: finalSlug,
          description:
            description !== undefined ? description.trim() || null : undefined,
        },
      })

      const products = await tx.product.findMany({
        where: {
          categoryId: id,
        },
      })

      await Promise.all(
        products.map((product) =>
          tx.product.update({
            where: {
              id: product.id,
            },
            data: {
              searchText: buildProductSearchText({
                name: product.name,
                slug: product.slug,
                description: product.description,
                material: product.material,
                color: product.color,
                dimensionsText: product.dimensionsText,
                weightText: product.weightText,
                careInstructions: product.careInstructions,
                categoryName: updatedCategory.name,
              }),
            },
          }),
        ),
      )

      return updatedCategory
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        "Another category with this name or slug already exists",
        409,
        "CATEGORY_ALREADY_EXISTS",
      )
    }

    throw error
  }
}

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  })

  if (!category) {
    throw new AppError("Category not found", 404, "CATEGORY_NOT_FOUND")
  }

  const productCount = await prisma.product.count({
    where: {
      categoryId: id,
    },
  })

  if (productCount > 0) {
    throw new AppError(
      "Cannot delete category because it still has products",
      400,
      "CATEGORY_HAS_PRODUCTS",
    )
  }

  return prisma.category.delete({
    where: { id },
  })
}
