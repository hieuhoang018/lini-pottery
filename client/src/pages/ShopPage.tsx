import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { getCategories } from "../api/categoryApi"
import { getProducts } from "../api/productApi"
import { ProductCard } from "../components/products/ProductCard"
import type { Product } from "../types/product"
import type { Category } from "../types/category"

type SortOption = "newest" | "price_asc" | "price_desc"

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [availableOnly, setAvailableOnly] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => setError(err.response?.data?.message || err.message))
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
    }, 400)

    return () => window.clearTimeout(timeoutId)
  }, [searchTerm])

  useEffect(() => {
    setLoading(true)
    setError("")

    getProducts({
      search: debouncedSearchTerm || undefined,
      category: selectedCategory || undefined,
      sort: sortOption,
      availableOnly,
    })
      .then(setProducts)
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false))
  }, [debouncedSearchTerm, selectedCategory, sortOption, availableOnly])

  const clearFilters = () => {
    setSearchTerm("")
    setDebouncedSearchTerm("")
    setSelectedCategory("")
    setSortOption("newest")
    setAvailableOnly(false)
  }

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

        <section className="mb-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              />

              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-xl border border-stone-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value as SortOption)
              }
              className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>

            <label className="flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(event) => setAvailableOnly(event.target.checked)}
                className="h-4 w-4 accent-amber-800"
              />
              Available only
            </label>

            <button
              onClick={clearFilters}
              className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100"
            >
              Clear
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className={`rounded-full border px-5 py-2 text-sm font-medium ${
                selectedCategory === ""
                  ? "border-amber-800 bg-amber-800 text-white"
                  : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
              }`}
              onClick={() => setSelectedCategory("")}
            >
              Tất cả
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
          </div>
        </section>

        {error && (
          <p className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>
        )}

        {loading ? (
          <section className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
              >
                <div className="h-64 animate-pulse bg-stone-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200" />
                  <div className="h-10 w-full animate-pulse rounded bg-stone-200" />
                </div>
              </div>
            ))}
          </section>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-stone-800">
              No products found
            </h2>

            <p className="mt-2 text-stone-600">
              Try changing your search, category, or availability filter.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-amber-800 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-900"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-stone-600">
              Showing{" "}
              <span className="font-semibold text-stone-900">
                {products.length}
              </span>{" "}
              product{products.length === 1 ? "" : "s"}
            </p>

            <section className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  )
}
