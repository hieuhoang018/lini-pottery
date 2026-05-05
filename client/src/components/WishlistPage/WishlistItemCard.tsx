import { Link } from "react-router-dom"
import type { WishlistItem } from "../../types/wishlist"
import { useCart } from "../../contexts/CartContext"

type WishlistItemCardProps = {
  item: WishlistItem
  onRemove: (id: string) => void
}

export function WishlistItemCard({ item, onRemove }: WishlistItemCardProps) {
  const { addToCart } = useCart()
  const product = item.product

  const image =
    product.featuredImageUrl ||
    product.images[0]?.imageUrl ||
    "/placeholder.png"

  const isOutOfStock = product.stockQuantity <= 0

  return (
    <article
      key={item.id}
      className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200"
    >
      <Link to={`/products/${product.slug}`}>
        <img
          src={image}
          alt={product.name}
          className="h-64 w-full bg-stone-200 object-cover"
        />
      </Link>

      <div className="p-5">
        <p className="text-sm font-semibold text-amber-800">
          {product.category.name}
        </p>

        <Link to={`/products/${product.slug}`}>
          <h2 className="mt-2 text-lg font-semibold hover:text-amber-800">
            {product.name}
          </h2>
        </Link>

        <p className="mt-2 text-sm text-stone-600">{product.price}đ</p>

        <div className="mt-5 flex gap-3">
          <button
            disabled={isOutOfStock}
            onClick={() => addToCart(product, 1)}
            className="flex-1 rounded-full bg-amber-800 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-900 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
          </button>

          <button
            onClick={() => onRemove(product.id)}
            className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Xóa
          </button>
        </div>
      </div>
    </article>
  )
}
