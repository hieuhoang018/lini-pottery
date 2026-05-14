import { Link, useParams } from "react-router-dom"
import { getCategories } from "../../api/categoryApi"
import { getProductById } from "../../api/productApi"
import type { Product } from "../../types/product"
import type { Category } from "../../types/category"
import { useApiFetch } from "../../hooks/useApiFetch"
import { ProductEditForm } from "../../components/AdminPage/ProductPage/ProductEditForm"
import { ProductImagesManager } from "../../components/AdminPage/ProductPage/ProductImagesManager"
import { AdminProductDetailSkeleton } from "../../components/skeletons/AdminProductDetailSkeleton"

export function AdminProductDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: product, loading: loadingProducts } =
    useApiFetch<Product>(async () => {
      if (!id) {
        throw new Error("Product id is missing")
      }

      return getProductById(id)
    }, [id])

  const { data: categories, loading: loadingCategories } = useApiFetch<
    Category[]
  >(() => {
    return getCategories()
  }, [])

  const loading = loadingProducts || loadingCategories

  if (loading) {
    return <AdminProductDetailSkeleton />
  }

  if (!categories || !id) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <p className="text-stone-600">Có lỗi trong việc tải sản phẩm.</p>
        <Link
          to="/admin/products"
          className="mt-4 inline-block text-amber-800 underline"
        >
          Quay về danh sách sản phẩm
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <p className="text-stone-600">Không tìm thấy sản phẩm.</p>
        <Link
          to="/admin/products"
          className="mt-4 inline-block text-amber-800 underline"
        >
          Quay về danh sách sản phẩm
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <Link
          to="/admin/products"
          className="mb-6 inline-block text-sm font-semibold text-amber-800"
        >
          ← Quay về danh sách sản phẩm
        </Link>

        <h2 className="text-2xl font-bold">Chỉnh sửa sản phẩm</h2>
        <p className="mt-2 text-sm text-stone-600">{product.id}</p>

        <ProductEditForm
          product={product}
          productId={id}
          categories={categories}
        />
      </section>

      <aside className="space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h3 className="text-xl font-semibold">Xem trước</h3>

          <img
            src={
              product.featuredImageUrl ||
              product.images[0]?.imageUrl ||
              "/placeholder.png"
            }
            alt={product.name}
            className="mt-4 h-64 w-full rounded-2xl bg-stone-200 object-cover"
          />

          <p className="mt-4 font-semibold">{product.name}</p>
          <p className="text-sm text-stone-600">{product.price}đ</p>
          <p className="mt-2 text-sm text-stone-600">
            {product.isActive ? "Active" : "Inactive"} · Hàng tồn kho:{" "}
            {product.stockQuantity}
          </p>
        </section>

        <ProductImagesManager product={product} productId={product.id} />
      </aside>
    </div>
  )
}
