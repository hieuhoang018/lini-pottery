import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { getCategories } from "../../api/categoryApi"
import { getProductById, updateProduct } from "../../api/productApi"
import { ProductImagesManager } from "../../components/admin/ProductImagesManager"
import type { Product, UpdateProductInput } from "../../types/product"
import type { Category } from "../../types/category"

export function AdminProductDetailPage() {
  const { id } = useParams<{ id: string }>()

  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<UpdateProductInput>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    if (!id) return

    try {
      setLoading(true)

      const [productData, categoryData] = await Promise.all([
        getProductById(id),
        getCategories(),
      ])

      setProduct(productData)
      setCategories(categoryData)

      setForm({
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: Number(productData.price),
        stockQuantity: productData.stockQuantity,
        categoryId: productData.categoryId,
        material: productData.material || "",
        color: productData.color || "",
        dimensionsText: productData.dimensionsText || "",
        weightText: productData.weightText || "",
        careInstructions: productData.careInstructions || "",
        featuredImageUrl: productData.featuredImageUrl || "",
        isActive: productData.isActive,
      })
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load product")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target

    if (name === "price" || name === "stockQuantity") {
      setForm((prev) => ({
        ...prev,
        [name]: Number(value),
      }))
      return
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!id) return

    if (!form.name || !form.slug || !form.description || !form.categoryId) {
      toast.error("Please fill in name, slug, description, and category")
      return
    }

    if (Number(form.price) <= 0) {
      toast.error("Price must be greater than 0")
      return
    }

    try {
      setSaving(true)

      const updated = await updateProduct(id, {
        ...form,
        material: form.material || undefined,
        color: form.color || undefined,
        dimensionsText: form.dimensionsText || undefined,
        weightText: form.weightText || undefined,
        careInstructions: form.careInstructions || undefined,
        featuredImageUrl: form.featuredImageUrl || undefined,
      })

      setProduct(updated)
      toast.success("Product updated")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update product")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-stone-600">Loading product...</p>
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

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-stone-700">
            Tên sản phẩm *
            <input
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </label>

          <label className="block text-sm font-medium text-stone-700">
            Slug *
            <input
              name="slug"
              value={form.slug || ""}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </label>

          <label className="block text-sm font-medium text-stone-700">
            Loại *
            <select
              name="categoryId"
              value={form.categoryId || ""}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              Giá tiền *
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price ?? 0}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
              />
            </label>

            <label className="block text-sm font-medium text-stone-700">
              Hàng tồn kho *
              <input
                name="stockQuantity"
                type="number"
                min="0"
                value={form.stockQuantity ?? 0}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-stone-700">
            Miêu tả *
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              rows={5}
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </label>

          {/* <label className="block text-sm font-medium text-stone-700">
            Featured image URL
            <input
              name="featuredImageUrl"
              value={form.featuredImageUrl || ""}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </label> */}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              Vật liệu
              <input
                name="material"
                value={form.material || ""}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
              />
            </label>

            <label className="block text-sm font-medium text-stone-700">
              Màu
              <input
                name="color"
                value={form.color || ""}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-stone-700">
            Kích thước
            <input
              name="dimensionsText"
              value={form.dimensionsText || ""}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </label>

          <label className="block text-sm font-medium text-stone-700">
            Cân nặng
            <input
              name="weightText"
              value={form.weightText || ""}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </label>

          <label className="block text-sm font-medium text-stone-700">
            Hướng dẫn bảo quản
            <textarea
              name="careInstructions"
              value={form.careInstructions || ""}
              onChange={handleChange}
              rows={3}
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </label>

          <button
            disabled={saving}
            className="w-full rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
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

        <ProductImagesManager productId={product.id} />
      </aside>
    </div>
  )
}
