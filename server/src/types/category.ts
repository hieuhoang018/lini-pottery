export type CreateCategoryInput = {
  name: string
  slug?: string
  description?: string
}

export type UpdateCategoryInput = {
  id: string
  name?: string
  slug?: string
  description?: string
}

export type CreateCategoryBody = {
  name?: string
  slug?: string
  description?: string
}

export type UpdateCategoryBody = {
  name?: string
  slug?: string
  description?: string
}
