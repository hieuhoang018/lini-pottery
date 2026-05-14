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
