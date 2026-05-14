import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"
import { createCategory, getCategories } from "../../api/categoryApi"
import { createProduct } from "../../api/productApi"
import { uploadProductImage } from "../../api/uploadApi"
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
  featuredImagePublicId: "",
}

export function AdminCreateProductPage() {
  const navigate = useNavigate()
  const [imageUploading, setImageUploading] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [creatingCategory, setCreatingCategory] = useState(false)

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
        featuredImagePublicId: data.featuredImagePublicId || undefined,
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

  const {
    data: categories,
    loading: loadingCategories,
    refetch: refetchCategories,
  } = useApiFetch<Category[]>(() => getCategories(), [])

  const setProductImageFields = (imageUrl: string, publicId: string) => {
    handleChange({
      target: {
        name: "featuredImageUrl",
        value: imageUrl,
      },
    } as React.ChangeEvent<HTMLInputElement>)

    handleChange({
      target: {
        name: "featuredImagePublicId",
        value: publicId,
      },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  const setCategoryField = (categoryId: string) => {
    handleChange({
      target: {
        name: "categoryId",
        value: categoryId,
      },
    } as React.ChangeEvent<HTMLSelectElement>)
  }

  const handleCreateCategory = async () => {
    const trimmedName = newCategoryName.trim()

    if (!trimmedName) {
      toast.error("Vui lòng nhập tên phân loại")
      return
    }

    try {
      setCreatingCategory(true)

      const category = await createCategory({
        name: trimmedName,
      })

      toast.success("Đã thêm phân loại")
      setNewCategoryName("")

      await refetchCategories()
      setCategoryField(category.id)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể thêm phân loại")
    } finally {
      setCreatingCategory(false)
    }
  }

  const handleProductImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    try {
      setImageUploading(true)

      const uploadedImage = await uploadProductImage(file)

      setProductImageFields(uploadedImage.imageUrl, uploadedImage.publicId)

      toast.success("Đã tải ảnh lên")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể tải ảnh lên")
    } finally {
      setImageUploading(false)
    }
  }

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

        <div>
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

          <div className="mt-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-sm font-medium text-stone-700">
              Chưa có phân loại phù hợp?
            </p>

            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                placeholder="Nhập tên phân loại mới"
                className="flex-1 rounded-xl border border-stone-300 px-4 py-3 text-sm"
              />

              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={creatingCategory}
                className="rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
              >
                {creatingCategory ? "Đang thêm..." : "Thêm"}
              </button>
            </div>

            <p className="mt-2 text-xs text-stone-500">
              Sau khi thêm, phân loại mới sẽ tự động được chọn cho sản phẩm này.
            </p>
          </div>
        </div>

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

        <div>
          <label className="block text-sm font-medium text-stone-700">
            Ảnh sản phẩm *
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleProductImageUpload}
            className="mt-2 block w-full rounded-xl border border-stone-300 px-4 py-3 text-sm"
          />

          {imageUploading && (
            <p className="mt-2 text-sm text-stone-500">Đang tải ảnh lên...</p>
          )}

          {formData.featuredImageUrl && (
            <div className="mt-4 rounded-2xl border border-stone-200 p-3">
              <img
                src={formData.featuredImageUrl}
                alt="Xem trước ảnh sản phẩm"
                className="h-48 w-48 rounded-xl object-cover"
              />

              <p className="mt-2 break-all text-xs text-stone-500">
                {formData.featuredImageUrl}
              </p>
            </div>
          )}
        </div>

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
          disabled={loadingProductCreate || imageUploading || creatingCategory}
          className="w-full rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {loadingProductCreate
            ? "Đang thêm..."
            : imageUploading
              ? "Đang tải ảnh..."
              : creatingCategory
                ? "Đang thêm phân loại..."
                : "Thêm sản phẩm"}
        </button>
      </form>
    </section>
  )
}
