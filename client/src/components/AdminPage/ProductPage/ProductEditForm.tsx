import toast from "react-hot-toast"
import { updateProduct } from "../../../api/productApi"
import { useForm } from "../../../hooks/useForm"
import type { UpdateProductInput } from "../../../types/api-input"
import type { Product } from "../../../types/product"
import { useEffect } from "react"
import type { Category } from "../../../types/category"
import { InputField } from "../../InputField"
import { ProductCoreFields } from "./ProductCoreFields"

type ProductEditFormProps = {
  product: Product
  productId: string
  categories: Category[]
}

export function ProductEditForm({
  product,
  productId,
  categories,
}: ProductEditFormProps) {
  const initialProductEditForm: UpdateProductInput = {
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    stockQuantity: product.stockQuantity,
    categoryId: product.categoryId,
    material: product.material || "",
    color: product.color || "",
    dimensionsText: product.dimensionsText || "",
    weightText: product.weightText || "",
    careInstructions: product.careInstructions || "",
    isActive: product.isActive,
  }

  const { formData, error, loading, handleChange, handleSubmit } =
    useForm<UpdateProductInput>({
      initialData: initialProductEditForm,
      onSubmit: async (data) => {
        await updateProduct(productId, {
          ...data,
          material: data.material || undefined,
          color: data.color || undefined,
          dimensionsText: data.dimensionsText || undefined,
          weightText: data.weightText || undefined,
          careInstructions: data.careInstructions || undefined,
        })
        toast.success("Đã cập nhật sản phẩm")
      },
    })

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <InputField
        name="name"
        value={formData.name}
        onChange={handleChange}
        isCompulsary
        label="Tên sản phẩm"
      />
      <InputField
        name="slug"
        value={formData.slug || ""}
        onChange={handleChange}
        isCompulsary
        label="Slug"
      />

      <label className="block text-sm font-medium text-stone-700">
        Phân loại *
        <select
          name="categoryId"
          value={formData.categoryId || ""}
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

      <ProductCoreFields formData={formData} onChange={handleChange} />

      <button
        disabled={loading}
        className="w-full rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900 disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        {loading ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  )
}
