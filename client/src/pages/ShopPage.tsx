import { useEffect, useState } from "react"
import { getCategories } from "../api/categoryApi"
import { getProducts } from "../api/productApi"
import { ProductCard } from "../components/products/ProductCard"
import type { Product } from "../types/product"
import type { Category } from "../types/category"

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => setError(err.response?.data?.message || err.message))
  }, [])

  useEffect(() => {
    setLoading(true)
    setError("")

    getProducts(selectedCategory || undefined)
      .then(setProducts)
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false))
  }, [selectedCategory])

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-stone-900">
      <div className="mx-auto max-w-7xl">
        <section className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-800">
            Handmade pottery
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Shop unique ceramic pieces
          </h1>
          <p className="mt-4 max-w-2xl text-stone-600">
            Browse handmade mugs, bowls, vases, tea sets, and decorative
            pottery.
          </p>
        </section>

        <section className="mb-8 flex flex-wrap gap-3">
          <button
            className={`rounded-full border px-5 py-2 text-sm font-medium ${
              selectedCategory === ""
                ? "border-amber-800 bg-amber-800 text-white"
                : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
            }`}
            onClick={() => setSelectedCategory("")}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              className={`rounded-full border px-5 py-2 text-sm font-medium ${
                selectedCategory === category.slug
                  ? "border-amber-800 bg-amber-800 text-white"
                  : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
              }`}
              onClick={() => setSelectedCategory(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </section>

        {error && (
          <p className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>
        )}

        {loading ? (
          <p className="text-stone-600">Loading products...</p>
        ) : (
          <section className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        )}
      </div>
    </main>
  )
}
