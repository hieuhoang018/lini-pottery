import { useEffect, useState } from "react"
import { useApiFetch } from "./useApiFetch"
import type { PaginatedResponse } from "../types/pagination"

export function usePaginatedFetch<T>(
  requestFn: (page: number) => Promise<T | PaginatedResponse<T>>,
  resetDeps: React.DependencyList,
) {
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, resetDeps)

  const result = useApiFetch<T>(() => requestFn(page), [...resetDeps, page])

  return { ...result, page, setPage }
}
