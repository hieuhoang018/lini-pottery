import toast from "react-hot-toast"
import { useCart } from "../../contexts/CartContext"
import type { Product } from "../../types/product"
import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { addWishlistItem } from "../../api/wishlistApi"

export function ActionPanel({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [addingToCart, setAddingToCart] = useState(false)
  const [addingToWishlist, setAddingToWishlist] = useState(false)

  const isOutOfStock = product.stockQuantity <= 0

  const handleAddToCart = async () => {
    if (!product) return

    try {
      setAddingToCart(true)
      await addToCart(product, 1)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể thêm vào giỏ hàng")
    } finally {
      setAddingToCart(false)
    }
  }

  const handleAddToWishlist = async () => {
    if (!product) return

    if (!user) {
      toast.error("Please log in to use wishlist")
      return
    }

    try {
      setAddingToWishlist(true)
      await addWishlistItem(product.id)
      toast.success("Added to wishlist")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add to wishlist")
    } finally {
      setAddingToWishlist(false)
    }
  }

  return (
    <div className="mt-8 flex gap-3">
      <button
        disabled={isOutOfStock || addingToCart}
        onClick={handleAddToCart}
        className="rounded-full bg-amber-800 hover:bg-amber-900 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        {addingToCart ? "Đang thêm vào giỏ hàng..." : "Thêm vào giỏ hàng"}
      </button>
      <button
        onClick={handleAddToWishlist}
        disabled={addingToWishlist}
        className="rounded-full border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-800 hover:bg-stone-100 disabled:cursor-not-allowed disabled:bg-stone-100"
      >
        {addingToWishlist
          ? "Đang thêm vào danh sách yêu thích..."
          : "Thêm vào danh sách yêu thích"}
      </button>
    </div>
  )
}
