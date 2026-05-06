import type { WishlistItem } from "../../types/wishlist"
import { getWishlist, removeWishlistItem } from "../../api/wishlistApi"
import toast from "react-hot-toast"
import { WishlistItemCard } from "./WishlistItemCard"
import { Emptylist } from "../layout/EmptyList"
import { useApiFetch } from "../../hooks/useApiFetch"

export function MainWishlistSection() {
  const {
    data: items,
    loading,
    refetch,
  } = useApiFetch<WishlistItem[]>(() => getWishlist(), [])

  const handleRemove = async (productId: string) => {
    try {
      await removeWishlistItem(productId)
      toast.success("Removed from wishlist")
      refetch()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove item")
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-6xl text-stone-600">
          Loading wishlist...
        </div>
      </main>
    )
  }

  if (!items || items.length === 0) {
    return <Emptylist subtitle="Danh sách yêu thích của bạn trống" />
  }

  return (
    <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        return <WishlistItemCard item={item} onRemove={handleRemove} />
      })}
    </section>
  )
}
