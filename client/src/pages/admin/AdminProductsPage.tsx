import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import {
  getAdminProducts,
  updateProductActiveStatus,
  updateProductStock,
} from "../../api/productApi"
import type { Product } from "../../types/product"

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const productData = await getAdminProducts()
      setProducts(productData)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  if (loading) {
    return <p className="text-stone-600">Loading products...</p>
  }

  return (
    <>
      <section className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Products</h2>
            <p className="mt-1 text-sm text-stone-600">
              Manage stock and product visibility.
            </p>
          </div>

          <div className="flex gap-3">
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
              Create product
            </Link>
          </div>
        </div>

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
                          Out of stock
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
                      Stock
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
                      Manage
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}
