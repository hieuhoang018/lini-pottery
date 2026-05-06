import { useEffect, useState } from "react"
import { useDebounce } from "../hooks/useDebounce"
import { getCategories } from "../api/categoryApi"
import { getProducts } from "../api/productApi"
import type { Product } from "../types/product"
import type { Category } from "../types/category"
import { SkeletonLoading } from "../components/ShopPage/SkeletonLoading"
import { ShopActionPanel } from "../components/ShopPage/ActionPanel"
import { useApiFetch } from "../hooks/useApiFetch"
import { ProductList } from "../components/ShopPage/ProductList"
import type { SortOption } from "../types/params"
import { PaginationButtons } from "../components/PaginationButtons"

export function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [availableOnly, setAvailableOnly] = useState(false)
  const [page, setPage] = useState(1)
  const limit = 10

  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 400)

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useApiFetch<Category[]>(() => getCategories(), [])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm, selectedCategory, sortOption, availableOnly])

  const {
    data: products,
    pagination,
    loading: productsLoading,
    error: productsError,
  } = useApiFetch<Product[]>(
    () =>
      getProducts({
        search: debouncedSearchTerm || undefined,
        category: selectedCategory || undefined,
        sort: sortOption,
        availableOnly,
        page,
        limit,
      }),
    [debouncedSearchTerm, selectedCategory, sortOption, availableOnly, page],
  )

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSortOption("newest")
    setAvailableOnly(false)
  }

  const loading = categoriesLoading || productsLoading
  const error = categoriesError || productsError

  if (!categories || !products) {
    return <p>Không tải được sản phẩm.</p>
  }

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-10">
        <p className="text-sm font-bold uppercase tracking-widest text-amber-800">
          Handmade pottery
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          Shop unique ceramic pieces
        </h1>

        <p className="mt-4 max-w-2xl text-stone-600">
          Browse handmade mugs, bowls, vases, tea sets, and decorative pottery.
        </p>
      </section>

      <ShopActionPanel
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortOption={sortOption}
        setSortOption={setSortOption}
        availableOnly={availableOnly}
        setAvailableOnly={setAvailableOnly}
        categories={categories}
        clearFilters={clearFilters}
      />

      {error && (
        <p className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>
      )}

      {loading && <SkeletonLoading />}

      {!loading && products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <h2 className="text-xl font-semibold text-stone-800">
            Không có sản phẩm nào.
          </h2>

          <p className="mt-2 text-stone-600">
            Hãy thử thay đổi bộ lọc tìm kiếm, danh mục hoặc tình trạng sẵn có.
          </p>

          <button
            onClick={clearFilters}
            className="mt-5 rounded-xl bg-amber-800 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-900"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <ProductList products={products} />
      )}

      {pagination && (
        <PaginationButtons pagination={pagination} onPageChange={setPage} />
      )}
    </div>
  )
}
