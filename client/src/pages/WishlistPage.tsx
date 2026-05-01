import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { getWishlist, removeWishlistItem } from "../api/wishlistApi"
import { useCart } from "../contexts/CartContext"
import type { WishlistItem } from "../types/wishlist"

export function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const data = await getWishlist()
      setItems(data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load wishlist")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const handleRemove = async (productId: string) => {
    try {
      await removeWishlistItem(productId)
      toast.success("Removed from wishlist")
      fetchWishlist()
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

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-stone-900">Wishlist</h1>
          <p className="mt-4 text-stone-600">Your wishlist is empty.</p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-amber-800 px-6 py-3 font-semibold text-white"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-stone-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Wishlist</h1>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const product = item.product
            const image =
              product.featuredImageUrl ||
              product.images[0]?.imageUrl ||
              "/placeholder.png"

            const isOutOfStock = product.stockQuantity <= 0

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200"
              >
                <Link to={`/products/${product.slug}`}>
                  <img
                    src={image}
                    alt={product.name}
                    className="h-64 w-full bg-stone-200 object-cover"
                  />
                </Link>

                <div className="p-5">
                  <p className="text-sm font-semibold text-amber-800">
                    {product.category.name}
                  </p>

                  <Link to={`/products/${product.slug}`}>
                    <h2 className="mt-2 text-lg font-semibold hover:text-amber-800">
                      {product.name}
                    </h2>
                  </Link>

                  <p className="mt-2 text-sm text-stone-600">
                    €{product.price}
                  </p>

                  <div className="mt-5 flex gap-3">
                    <button
                      disabled={isOutOfStock}
                      onClick={() => addToCart(product, 1)}
                      className="flex-1 rounded-full bg-amber-800 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-900 disabled:cursor-not-allowed disabled:bg-stone-300"
                    >
                      {isOutOfStock ? "Out of stock" : "Add to cart"}
                    </button>

                    <button
                      onClick={() => handleRemove(product.id)}
                      className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      </div>
    </main>
  )
}
