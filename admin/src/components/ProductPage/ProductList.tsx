import { Link } from "react-router-dom"
import type { Product } from "../../types/product"

type ProductListProps = {
  products: Product[]
  handleStockChange: (productId: string, value: string) => void
  handleToggleActive: (product: Product) => void
}

export function ProductList({
  products,
  handleStockChange,
  handleToggleActive,
}: ProductListProps) {
  return (
    <>
      <p className="mb-4 text-sm text-stone-600">
        Showing{" "}
        <span className="font-semibold text-stone-900">{products.length}</span>{" "}
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
                    {product.category.name} · {product.price}đ
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
                    to={`/products/${product.id}`}
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
  )
}
