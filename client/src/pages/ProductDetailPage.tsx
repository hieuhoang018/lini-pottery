import { Link, useParams } from "react-router-dom"
import { getProductBySlug } from "../api/productApi"
import type { Product } from "../types/product"
import { ImageGallery } from "../components/ProductDetailPage/ImageGallery"
import { ProductDetail } from "../components/ProductDetailPage/ProductDetail"
import { ActionPanel } from "../components/ProductDetailPage/ActionPanel"
import { useApiFetch } from "../hooks/useApiFetch"

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const {
    data: product,
    loading,
    error,
  } = useApiFetch<Product>(async () => {
    if (!slug) {
      throw new Error("Slug is missing")
    }
    return getProductBySlug(slug)
  }, [slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-5xl text-stone-600">
          Đang tải sản phẩm
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="rounded-xl bg-red-50 p-4 text-red-700">
            {error || "Không tìm thấy sản phẩm"}
          </p>
          <Link to="/" className="mt-6 inline-block text-amber-800 underline">
            Quay về cửa hàng
          </Link>
        </div>
      </main>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Link
        to="/"
        className="mb-8 inline-block text-sm font-medium text-amber-800"
      >
        ← Quay về cửa hàng
      </Link>

      <section className="grid gap-10 lg:grid-cols-2">
        <ImageGallery product={product} />

        <div>
          <ProductDetail product={product} />

          <ActionPanel product={product} />
        </div>
      </section>
    </div>
  )
}
