import { useEffect, useState } from "react"

type UseApiFetchResult<T> = {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useApiFetch<T>(
  requestFn: () => Promise<T>,
  dependencies: React.DependencyList = [],
): UseApiFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await requestFn()
      setData(result)
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
    loading,
    error,
    refetch: fetchData,
  }
}
