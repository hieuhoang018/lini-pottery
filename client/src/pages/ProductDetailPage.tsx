import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getProductBySlug } from "../api/productApi"
import type { Product } from "../types/product"
import { useCart } from "../contexts/CartContext"
import toast from "react-hot-toast"
import { addWishlistItem } from "../api/wishlistApi"
import { useAuth } from "../contexts/AuthContext"

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const [addingToWishlist, setAddingToWishlist] = useState(false)

  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState("")
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [error, setError] = useState("")

  const { addToCart } = useCart()
  useEffect(() => {
    if (!slug) return

    setLoading(true)
    setError("")

    getProductBySlug(slug)
      .then((data) => {
        setProduct(data)
        setSelectedImage(
          data.featuredImageUrl ||
            data.images[0]?.imageUrl ||
            "/placeholder.png",
        )
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false))
  }, [slug])

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

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <p className="mx-auto max-w-7xl text-stone-600">Loading product...</p>
      </main>
    )
  }

  const handleAddToCart = async () => {
    if (!product) return

    try {
      setAddingToCart(true)
      await addToCart(product, 1)
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to add product to cart",
      )
    } finally {
      setAddingToCart(false)
    }
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="rounded-xl bg-red-50 p-4 text-red-700">
            {error || "Product not found"}
          </p>
          <Link to="/" className="mt-6 inline-block text-amber-800 underline">
            Quay về cửa hàng
          </Link>
        </div>
      </main>
    )
  }

  const images = [
    ...(product.featuredImageUrl
      ? [
          {
            id: "featured",
            imageUrl: product.featuredImageUrl,
            altText: product.name,
          },
        ]
      : []),
    ...product.images,
  ]

  const isOutOfStock = product.stockQuantity <= 0

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-stone-900">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/"
          className="mb-8 inline-block text-sm font-medium text-amber-800"
        >
          ← Quay về cửa hàng
        </Link>

        <section className="grid gap-10 lg:grid-cols-2">
          <div>
            <img
              src={selectedImage}
              alt={product.name}
              className="h-130 w-full rounded-3xl bg-stone-200 object-cover"
            />

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image.imageUrl)}
                    className={`overflow-hidden rounded-xl border ${
                      selectedImage === image.imageUrl
                        ? "border-amber-800"
                        : "border-stone-200"
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.altText || product.name}
                      className="h-20 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-amber-800">
              {product.category.name}
            </p>

            <h1 className="mt-3 text-4xl font-bold">{product.name}</h1>

            <p className="mt-4 text-2xl font-semibold">{product.price}đ</p>

            <p
              className={
                isOutOfStock ? "mt-3 text-red-600" : "mt-3 text-green-700"
              }
            >
              {isOutOfStock
                ? "Hết hàng"
                : `${product.stockQuantity} món còn lại`}
            </p>

            <p className="mt-6 leading-7 text-stone-700">
              {product.description}
            </p>

            <div className="mt-8 space-y-3 rounded-2xl bg-white p-5 ring-1 ring-stone-200">
              {product.material && (
                <p>
                  <span className="font-semibold">Vật liệu:</span>{" "}
                  {product.material}
                </p>
              )}
              {product.color && (
                <p>
                  <span className="font-semibold">Màu:</span> {product.color}
                </p>
              )}
              {product.dimensionsText && (
                <p>
                  <span className="font-semibold">Kích thước:</span>{" "}
                  {product.dimensionsText}
                </p>
              )}
              {product.weightText && (
                <p>
                  <span className="font-semibold">Cân nặng:</span>{" "}
                  {product.weightText}
                </p>
              )}
              {product.careInstructions && (
                <p>
                  <span className="font-semibold">Cách bảo quản:</span>{" "}
                  {product.careInstructions}
                </p>
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                disabled={isOutOfStock || addingToCart}
                onClick={handleAddToCart}
                className="rounded-full bg-amber-800 hover:bg-amber-900 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-stone-300"
              >
                {addingToCart
                  ? "Đang thêm vào giỏ hàng..."
                  : "Thêm vào giỏ hàng"}
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
          </div>
        </section>
      </div>
    </main>
  )
}
