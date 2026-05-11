import { useEffect, useState } from "react"
import type { PaginatedResponse, PaginationMeta } from "../types/pagination"

type UseApiFetchResult<T> = {
  data: T | null
  pagination: PaginationMeta | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

function isPaginatedResponse<T>(
  result: T | PaginatedResponse<T>,
): result is PaginatedResponse<T> {
  return (
    typeof result === "object" &&
    result !== null &&
    "data" in result &&
    "pagination" in result
  )
}

export function useApiFetch<T>(
  requestFn: () => Promise<T | PaginatedResponse<T>>,
  dependencies: React.DependencyList = [],
): UseApiFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await requestFn()

      if (isPaginatedResponse<T>(result)) {
        setData(result.data)
        setPagination(result.pagination)
      } else {
        setData(result)
        setPagination(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, dependencies)

  return {
    data,
    pagination,
    loading,
    error,
    refetch: fetchData,
  }
}
