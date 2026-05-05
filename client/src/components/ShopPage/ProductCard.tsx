import { Link } from "react-router-dom"
import type { Product } from "../../types/product"

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const image =
    product.featuredImageUrl ||
    product.images[0]?.imageUrl ||
    "/placeholder.png"

  const isOutOfStock = product.stockQuantity <= 0

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-md"
    >
      <img
        src={image}
        alt={product.name}
        className="h-64 w-full bg-stone-200 object-cover transition group-hover:scale-105"
      />

      <div className="p-5">
        <p className="text-sm font-semibold text-amber-800">
          {product.category.name}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-stone-900">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-stone-600">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <strong className="text-lg text-stone-900">{product.price}đ</strong>
          <span
            className={
              isOutOfStock ? "text-sm text-red-600" : "text-sm text-green-700"
            }
          >
            {isOutOfStock ? "Hết hàng" : "Còn hàng"}
          </span>
        </div>
      </div>
    </Link>
  )
}
