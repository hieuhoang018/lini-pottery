import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { Search } from "lucide-react"
import { getCategories } from "../../api/categoryApi"
import {
  getAdminProducts,
  updateProductActiveStatus,
  updateProductStock,
} from "../../api/productApi"
import type { Product } from "../../types/product"
import type { Category } from "../../types/category"

type SortOption = "newest" | "price_asc" | "price_desc"
type ActiveFilter = "all" | "active" | "inactive"
type StockFilter = "all" | "available" | "out_of_stock"

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all")
  const [stockFilter, setStockFilter] = useState<StockFilter>("all")

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) =>
        toast.error(err.response?.data?.message || "Failed to load categories"),
      )
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
    }, 400)

    return () => window.clearTimeout(timeoutId)
  }, [searchTerm])

  const fetchData = async () => {
    try {
      setLoading(true)

      const productData = await getAdminProducts({
        search: debouncedSearchTerm || undefined,
        category: selectedCategory || undefined,
        sort: sortOption,
        availableOnly: stockFilter === "available" ? true : undefined,
      })

      let filteredProducts = productData

      if (activeFilter === "active") {
        filteredProducts = filteredProducts.filter(
          (product) => product.isActive,
        )
      }

      if (activeFilter === "inactive") {
        filteredProducts = filteredProducts.filter(
          (product) => !product.isActive,
        )
      }

      if (stockFilter === "out_of_stock") {
        filteredProducts = filteredProducts.filter(
          (product) => product.stockQuantity <= 0,
        )
      }

      setProducts(filteredProducts)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [
    debouncedSearchTerm,
    selectedCategory,
    sortOption,
    activeFilter,
    stockFilter,
  ])

  const clearFilters = () => {
    setSearchTerm("")
    setDebouncedSearchTerm("")
    setSelectedCategory("")
    setSortOption("newest")
    setActiveFilter("all")
    setStockFilter("all")
  }

  const handleStockChange = async (productId: string, value: string) => {
    const stockQuantity = Number(value)

    if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
      toast.error("Stock must be a valid non-negative number")
      return
    }

    try {
      await updateProductStock(productId, stockQuantity)
      toast.success("Stock updated")
      fetchData()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update stock")
    }
  }

  const handleToggleActive = async (product: Product) => {
    try {
      await updateProductActiveStatus(product.id, !product.isActive)
      toast.success(
        product.isActive ? "Product deactivated" : "Product activated",
      )
      fetchData()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update product")
    }
  }

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
            onClick={fetchData}
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-stone-100"
          >
            Refresh
          </button>

          <Link
            to="/admin/products/new"
            className="rounded-full bg-amber-800 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-900"
          >
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      <section className="mb-5 rounded-2xl border border-stone-200 bg-stone-50 p-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto_auto_auto_auto]">
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
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={activeFilter}
            onChange={(event) =>
              setActiveFilter(event.target.value as ActiveFilter)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
          >
            <option value="all">All statuses</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </select>

          <select
            value={stockFilter}
            onChange={(event) =>
              setStockFilter(event.target.value as StockFilter)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
          >
            <option value="all">All stock</option>
            <option value="available">Available only</option>
            <option value="out_of_stock">Out of stock</option>
          </select>

          <select
            value={sortOption}
            onChange={(event) =>
              setSortOption(event.target.value as SortOption)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price low to high</option>
            <option value="price_desc">Price high to low</option>
          </select>

          <button
            onClick={clearFilters}
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100"
          >
            Clear
          </button>
        </div>
      </section>

      {loading ? (
        <p className="text-stone-600">Loading products...</p>
      ) : products.length === 0 ? (
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
        <>
          <p className="mb-4 text-sm text-stone-600">
            Showing{" "}
            <span className="font-semibold text-stone-900">
              {products.length}
            </span>{" "}
            product{products.length === 1 ? "" : "s"}
          </p>

          <div className="space-y-4">
            {products.map((product) => {
              const image =
                product.featuredImageUrl ||
                product.images[0]?.imageUrl ||
                "/placeholder.png"

              return (
                <article
                  key={product.id}
                  className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200"
                >
                  <div className="grid gap-4 md:grid-cols-[100px_1fr_auto]">
                    <img
                      src={image}
                      alt={product.name}
                      className="h-24 w-24 rounded-xl bg-stone-200 object-cover"
                    />

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{product.name}</h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            product.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>

                        {product.stockQuantity <= 0 && (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                            Hết hàng
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-stone-500">
                        {product.category.name} · €{product.price}
                      </p>

                      <p className="mt-2 line-clamp-2 text-sm text-stone-600">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 md:w-40">
                      <label className="text-sm font-medium text-stone-700">
                        Hàng tồn kho
                        <input
                          type="number"
                          min="0"
                          defaultValue={product.stockQuantity}
                          onBlur={(event) =>
                            handleStockChange(product.id, event.target.value)
                          }
                          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
                        />
                      </label>

                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          product.isActive
                            ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                            : "bg-amber-800 text-white hover:bg-amber-900"
                        }`}
                      >
                        {product.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <Link
                        to={`/admin/products/${product.id}`}
                        className="rounded-full border border-stone-300 bg-white px-4 py-2 text-center text-sm font-semibold text-stone-700 hover:bg-stone-100"
                      >
                        Quản lý
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}
