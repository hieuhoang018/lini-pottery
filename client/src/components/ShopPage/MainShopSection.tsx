import { useState } from "react"
import { ShopActionPanel } from "./ActionPanel"
import type { SortOption } from "../../types/params"
import { useDebounce } from "../../hooks/useDebounce"
import { useApiFetch } from "../../hooks/useApiFetch"
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch"
import type { Category } from "../../types/category"
import { getCategories } from "../../api/categoryApi"
import type { Product } from "../../types/product"
import { getProducts } from "../../api/productApi"
import { ShopSkeletonLoading } from "../skeletons/ShopSkeletonLoading"
import { ProductList } from "./ProductList"
import { PaginationButtons } from "../PaginationButtons"

export function MainShopSection() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [availableOnly, setAvailableOnly] = useState(false)
  const limit = 10

  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 400)

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useApiFetch<Category[]>(() => getCategories(), [])

  const {
    data: products,
    pagination,
    loading: productsLoading,
    error: productsError,
    setPage,
  } = usePaginatedFetch<Product[]>(
    (page) =>
      getProducts({
        search: debouncedSearchTerm || undefined,
        category: selectedCategory || undefined,
        sort: sortOption,
        availableOnly,
        page,
        limit,
      }),
    [debouncedSearchTerm, selectedCategory, sortOption, availableOnly],
  )

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSortOption("newest")
    setAvailableOnly(false)
  }

  const loading = categoriesLoading || productsLoading
  const error = categoriesError || productsError

  const safeCategories = categories ?? []
  const safeProducts = products ?? []

  if (!loading && (!categories || !products)) {
    return <p>Không tải được sản phẩm.</p>
  }

  return (
    <>
      <ShopActionPanel
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortOption={sortOption}
        setSortOption={setSortOption}
        availableOnly={availableOnly}
        setAvailableOnly={setAvailableOnly}
        categories={safeCategories}
        clearFilters={clearFilters}
      />

      {error && (
        <p className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>
      )}

      {loading ? (
        <ShopSkeletonLoading />
      ) : safeProducts.length === 0 ? (
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
        <ProductList products={safeProducts} />
      )}

      {!loading && pagination && (
        <PaginationButtons pagination={pagination} onPageChange={setPage} />
      )}
    </>
  )
}
