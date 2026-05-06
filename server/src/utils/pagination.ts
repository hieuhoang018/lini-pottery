import { PaginationQuery } from "../types/query"

export const getPaginationParams = (query: PaginationQuery) => {
  const page = Math.max(Number(query.page) || 1, 1)

  // optional: prevent users from requesting too much data
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100)

  const skip = (page - 1) * limit

  return {
    page,
    limit,
    skip,
  }
}

export const buildPaginationMeta = ({
  page,
  limit,
  totalItems,
}: {
  page: number
  limit: number
  totalItems: number
}) => {
  const totalPages = Math.ceil(totalItems / limit)

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  }
}
