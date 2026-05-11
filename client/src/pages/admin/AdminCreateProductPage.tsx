import { useEffect } from "react"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"
import { getCategories } from "../../api/categoryApi"
import { createProduct } from "../../api/productApi"
import type { CreateProductInput } from "../../types/api-input"
import type { Category } from "../../types/category"
import { createSlug } from "../../utils/createSlug"
import { useForm } from "../../hooks/useForm"
import { useApiFetch } from "../../hooks/useApiFetch"
import { InputField } from "../../components/InputField"
import { AdminCreateProductSkeleton } from "../../components/skeletons/AdminCreateProductSkeleton"

const initialCreateProductForm: CreateProductInput = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  stockQuantity: 1,
  categoryId: "",
  material: "",
  color: "",
  dimensionsText: "",
  weightText: "",
  careInstructions: "",
  featuredImageUrl: "",
}

export function AdminCreateProductPage() {
  const navigate = useNavigate()

  const {
    formData,
    error,
    loading: loadingProductCreate,
    handleChange,
    handleSubmit,
  } = useForm<CreateProductInput>({
    initialData: initialCreateProductForm,
    onSubmit: async (data) => {
      const product = await createProduct({
        ...data,
        slug: data.slug || createSlug(data.name),
        material: data.material || undefined,
        color: data.color || undefined,
        dimensionsText: data.dimensionsText || undefined,
        weightText: data.weightText || undefined,
        careInstructions: data.careInstructions || undefined,
        featuredImageUrl: data.featuredImageUrl || undefined,
      })

      toast.success("Đã tạo sản phẩm")
      navigate(`/admin/products/${product.id}`)
    },
  })

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const { data: categories, loading: loadingCategories } = useApiFetch<
    Category[]
  >(() => getCategories(), [])

  if (loadingCategories) {
    return <AdminCreateProductSkeleton />
  }

  if (!categories) {
    return <p>Lỗi khi tải phân loại sản phẩm</p>
  }

  return (
    <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <Link
        to="/admin/products"
        className="mb-6 inline-block text-sm font-semibold text-amber-800"
      >
        ← Quay về danh sách sản phẩm
      </Link>

      <h2 className="text-2xl font-bold">Thêm sản phẩm</h2>
      <p className="mt-2 text-sm text-stone-600">
        Thêm một sản phẩm vào cửa hàng.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <InputField
          name="name"
          label="Tên sản phẩm"
          onChange={handleChange}
          isCompulsary
          value={formData.name}
        />
        <InputField
          name="slug"
          label="Slug"
          onChange={handleChange}
          isCompulsary
          value={formData.slug || createSlug(formData.name)}
        />

        <label className="block text-sm font-medium text-stone-700">
          Phân loại *
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
          >
            <option value="">Chọn phân loại</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            name="price"
            inputType="number"
            label="Giá tiền"
            onChange={handleChange}
            isCompulsary
            value={formData.price}
          />
          <InputField
            name="stockQuantity"
            inputType="number"
            label="Số lượng tồn kho"
            onChange={handleChange}
            isCompulsary
            value={formData.stockQuantity}
          />
        </div>
        <InputField
          name="description"
          label="Miêu tả"
          onChange={handleChange}
          isCompulsary
          value={formData.description}
        />
        <InputField
          name="featuredImageUrl"
          label="URL ảnh"
          onChange={handleChange}
          isCompulsary
          value={formData.featuredImageUrl}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            name="material"
            label="Vật liệu"
            onChange={handleChange}
            isCompulsary={false}
            value={formData.material}
          />
          <InputField
            name="color"
            label="Màu sắc"
            onChange={handleChange}
            isCompulsary={false}
            value={formData.color}
          />
        </div>
        <InputField
          name="dimensionsText"
          label="Kích thước"
          onChange={handleChange}
          isCompulsary={false}
          value={formData.dimensionsText}
        />
        <InputField
          name="weightText"
          label="Cân nặng"
          onChange={handleChange}
          isCompulsary={false}
          value={formData.weightText}
        />
        <InputField
          name="careInstructions"
          label="Hướng dẫn bảo quản"
          onChange={handleChange}
          isCompulsary={false}
          value={formData.careInstructions}
        />

        <button
          disabled={loadingProductCreate}
          className="w-full rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {loadingProductCreate ? "Đang thêm..." : "Thêm sản phẩm"}
        </button>
      </form>
    </section>
  )
}
