import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import toast from "react-hot-toast"
import type { WishlistItem } from "../../types/wishlist"
import { getWishlist, removeWishlistItem } from "../../api/wishlistApi"
import { WishlistItemCard } from "./WishlistItemCard"
import { Emptylist } from "../layout/EmptyList"
import { useApiFetch } from "../../hooks/useApiFetch"
import { useDebounce } from "../../hooks/useDebounce"
import { PaginationButtons } from "../PaginationButtons"

export function MainWishlistSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)

  const limit = 10
  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 400)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm])

  const {
    data: items,
    pagination,
    loading,
    error,
    refetch,
  } = useApiFetch<WishlistItem[]>(
    () =>
      getWishlist({
        search: debouncedSearchTerm || undefined,
        page,
        limit,
      }),
    [debouncedSearchTerm, page],
  )

  const handleRemove = async (productId: string) => {
    try {
      await removeWishlistItem(productId)
      toast.success("Removed from wishlist")
      refetch()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove item")
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    setPage(1)
  }

  if (loading && !items) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-6xl text-stone-600">
          Loading wishlist...
        </div>
      </main>
    )
  }

  return (
    <>
      <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search wishlist products..."
            className="w-full rounded-xl border border-stone-300 py-3 pl-12 pr-4 text-sm outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-800/20"
          />
        </div>
      </div>

      {error && (
        <p className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>
      )}

      {loading && (
        <p className="mb-6 text-sm text-stone-500">Loading wishlist...</p>
      )}

      {!loading && (!items || items.length === 0) ? (
        searchTerm ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-stone-800">
              Không tìm thấy sản phẩm yêu thích nào.
            </h2>

            <p className="mt-2 text-stone-600">
              Hãy thử thay đổi từ khóa tìm kiếm.
            </p>

            <button
              onClick={clearSearch}
              className="mt-5 rounded-xl bg-amber-800 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-900"
            >
              Xóa tìm kiếm
            </button>
          </div>
        ) : (
          <Emptylist subtitle="Danh sách yêu thích của bạn trống" />
        )
      ) : (
        <>
          <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items?.map((item) => {
              return (
                <WishlistItemCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                />
              )
            })}
          </section>

          {pagination && (
            <PaginationButtons pagination={pagination} onPageChange={setPage} />
          )}
        </>
      )}
    </>
  )
}
