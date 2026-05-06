import { useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { getCategories } from "../../api/categoryApi"
import {
  getAdminProducts,
  updateProductActiveStatus,
  updateProductStock,
} from "../../api/productApi"
import type { Product } from "../../types/product"
import type { Category } from "../../types/category"
import { useDebounce } from "../../hooks/useDebounce"
import { useApiFetch } from "../../hooks/useApiFetch"
import { ProductList } from "../../components/AdminPage/ProductPage/ProductList"
import type { ActiveFilter, SortOption, StockFilter } from "../../types/params"
import { ActionPanel } from "../../components/AdminPage/ProductPage/ActionPanel"

export function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all")
  const [stockFilter, setStockFilter] = useState<StockFilter>("all")

  const debouncedSearchTerm = useDebounce(searchTerm, 400)

  const { data: categories, loading: loadingCategories } = useApiFetch<
    Category[]
  >(async () => {
    return getCategories()
  }, [])

  const {
    data: products,
    loading: loadingProducts,
    refetch: refetchProducts,
  } = useApiFetch<Product[]>(async () => {
    return getAdminProducts({
      search: debouncedSearchTerm || undefined,
      category: selectedCategory || undefined,
      sort: sortOption,
      stock: stockFilter,
      active: activeFilter,
    })
  }, [
    debouncedSearchTerm,
    selectedCategory,
    sortOption,
    activeFilter,
    stockFilter,
  ])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSortOption("newest")
    setActiveFilter("all")
    setStockFilter("all")
  }

  const handleStockChange = async (productId: string, value: string) => {
    const stockQuantity = Number(value)

    if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
      toast.error("Số hàng tồn kho không thể là số âm")
      return
    }

    try {
      await updateProductStock(productId, stockQuantity)
      toast.success("Đã cập nhật số hàng tồn kho")
      refetchProducts()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update stock")
    }
  }

  const handleToggleActive = async (product: Product) => {
    try {
      await updateProductActiveStatus(product.id, !product.isActive)
      toast.success(
        product.isActive ? "Đã vô hiệu hóa sản phẩm" : "Đã kích hoạt sản phẩm",
      )
      refetchProducts()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update product")
    }
  }

  if (!categories) {
    return
  }

  if (!products) {
    return
  }

  const loading = loadingCategories || loadingProducts

  return (
    <section className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Sản phẩm</h2>
          <p className="mt-1 text-sm text-stone-600">
            Quản lý tồn kho và hiển thị sản phẩm.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={refetchProducts}
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-stone-100"
          >
            Làm mới
          </button>

          <Link
            to="/admin/products/new"
            className="rounded-full bg-amber-800 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-900"
          >
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      <ActionPanel
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        sortOption={sortOption}
        activeFilter={activeFilter}
        stockFilter={stockFilter}
        categories={categories}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onSortChange={setSortOption}
        onActiveFilterChange={setActiveFilter}
        onStockFilterChange={setStockFilter}
        onClearFilters={clearFilters}
      />

      {loading && <p className="text-stone-600">Loading products...</p>}

      {!loading && products.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-stone-200">
          <p className="text-stone-600">No products found.</p>

          <button
            onClick={clearFilters}
            className="mt-4 rounded-full bg-amber-800 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-900"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ProductList
          products={products}
          handleStockChange={handleStockChange}
          handleToggleActive={handleToggleActive}
        />
      )}
    </section>
  )
}
