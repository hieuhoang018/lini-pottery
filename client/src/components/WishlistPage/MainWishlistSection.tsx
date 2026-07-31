import { useState } from "react"
import toast from "react-hot-toast"
import type { WishlistItem } from "../../types/wishlist"
import { getWishlist, removeWishlistItem } from "../../api/wishlistApi"
import { getErrorMessage } from "../../utils/getErrorMessage"
import { WishlistItemCard } from "./WishlistItemCard"
import { Emptylist } from "../layout/EmptyList"
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch"
import { useDebounce } from "../../hooks/useDebounce"
import { PaginationButtons } from "../PaginationButtons"
import { SearchInput } from "../SearchInput"
import { WishlistSkeletonLoading } from "../skeletons/WishlistSkeletonLoading"

export function MainWishlistSection() {
  const [searchTerm, setSearchTerm] = useState("")

  const limit = 10
  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 400)

  const {
    data: items,
    pagination,
    loading,
    error,
    refetch,
    setPage,
  } = usePaginatedFetch<WishlistItem[]>(
    (page) =>
      getWishlist({
        search: debouncedSearchTerm || undefined,
        page,
        limit,
      }),
    [debouncedSearchTerm],
  )

  const handleRemove = async (productId: string) => {
    try {
      await removeWishlistItem(productId)
      toast.success("Removed from wishlist")
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to remove item"))
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    setPage(1)
  }

  if (loading && !items) {
    return <WishlistSkeletonLoading />
  }

  return (
    <>
      <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Tìm sản phẩm..."
        />
      </div>

      {error && (
        <p className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>
      )}

      {loading ? (
        <WishlistSkeletonLoading />
      ) : !items || items.length === 0 ? (
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
            {items.map((item) => (
              <WishlistItemCard
                key={item.id}
                item={item}
                onRemove={handleRemove}
              />
            ))}
          </section>

          {pagination && (
            <PaginationButtons pagination={pagination} onPageChange={setPage} />
          )}
        </>
      )}
    </>
  )
}
