import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"
import { getCategories } from "../../api/categoryApi"
import { createProduct } from "../../api/productApi"
import type { CreateProductInput } from "../../types/product"
import type { Category } from "../../types/category"

const initialForm: CreateProductInput = {
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

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function AdminCreateProductPage() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<CreateProductInput>(initialForm)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)

        const data = await getCategories()
        setCategories(data)

        if (data[0]) {
          setForm((prev) => ({
            ...prev,
            categoryId: data[0].id,
          }))
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load categories")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target

    if (name === "name") {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: createSlug(value),
      }))
      return
    }

    if (name === "price") {
      setForm((prev) => ({
        ...prev,
        price: Number(value),
      }))
      return
    }

    if (name === "stockQuantity") {
      setForm((prev) => ({
        ...prev,
        stockQuantity: Number(value),
      }))
      return
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCreateProduct = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!form.name || !form.slug || !form.description || !form.categoryId) {
      toast.error("Please fill in name, slug, description, and category")
      return
    }

    if (form.price <= 0) {
      toast.error("Price must be greater than 0")
      return
    }

    if ((form.stockQuantity ?? 0) < 0) {
      toast.error("Stock cannot be negative")
      return
    }

    try {
      setCreating(true)

      const product = await createProduct({
        ...form,
        material: form.material || undefined,
        color: form.color || undefined,
        dimensionsText: form.dimensionsText || undefined,
        weightText: form.weightText || undefined,
        careInstructions: form.careInstructions || undefined,
        featuredImageUrl: form.featuredImageUrl || undefined,
      })

      toast.success("Product created")
      navigate(`/admin/products/${product.id}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create product")
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return <p className="text-stone-600">Loading categories...</p>
  }

  return (
    <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <Link
        to="/admin/products"
        className="mb-6 inline-block text-sm font-semibold text-amber-800"
      >
        ← Back to products
      </Link>

      <h2 className="text-2xl font-bold">Create product</h2>
      <p className="mt-2 text-sm text-stone-600">
        Add a new pottery item to the store.
      </p>

      <form onSubmit={handleCreateProduct} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-stone-700">
          Name *
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
          />
        </label>

        <label className="block text-sm font-medium text-stone-700">
          Slug *
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
          />
        </label>

        <label className="block text-sm font-medium text-stone-700">
          Category *
          <select
            name="categoryId"
            value={form.categoryId}
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
            Price *
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </label>

          <label className="block text-sm font-medium text-stone-700">
            Stock *
            <input
              name="stockQuantity"
              type="number"
              min="0"
              value={form.stockQuantity}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-stone-700">
          Description *
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
          />
        </label>

        <label className="block text-sm font-medium text-stone-700">
          Featured image URL
          <input
            name="featuredImageUrl"
            value={form.featuredImageUrl}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-stone-700">
            Material
            <input
              name="material"
              value={form.material}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </label>

          <label className="block text-sm font-medium text-stone-700">
            Color
            <input
              name="color"
              value={form.color}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-stone-700">
          Dimensions
          <input
            name="dimensionsText"
            value={form.dimensionsText}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
          />
        </label>

        <label className="block text-sm font-medium text-stone-700">
          Weight
          <input
            name="weightText"
            value={form.weightText}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
          />
        </label>

        <label className="block text-sm font-medium text-stone-700">
          Care instructions
          <textarea
            name="careInstructions"
            value={form.careInstructions}
            onChange={handleChange}
            rows={3}
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
          />
        </label>

        <button
          disabled={creating}
          className="w-full rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {creating ? "Creating..." : "Create product"}
        </button>
      </form>
    </section>
  )
}
