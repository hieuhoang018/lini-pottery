import { useCart } from "../../contexts/CartContext"
import type { CartDisplayItem } from "../../types/cart"

export function CartItemCard({ item }: { item: CartDisplayItem }) {
  const { updateQuantity, removeFromCart } = useCart()
  const image =
    item.product.featuredImageUrl ||
    item.product.images[0]?.imageUrl ||
    "/placeholder.png"

  return (
    <article
      key={item.product.id}
      className="flex gap-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200"
    >
      <img
        src={image}
        alt={item.product.name}
        className="h-28 w-28 rounded-xl bg-stone-200 object-cover"
      />

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h2 className="font-semibold">{item.product.name}</h2>
          <p className="mt-1 text-sm text-stone-500">{item.product.price}đ</p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
              className="h-8 w-8 rounded-full border border-stone-300 bg-white"
            >
              -
            </button>

            <span className="w-8 text-center">{item.quantity}</span>

            <button
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
              className="h-8 w-8 rounded-full border border-stone-300 bg-white"
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeFromCart(item.product.id)}
            className="text-sm font-semibold text-red-600 hover:underline"
          >
            Xóa hàng
          </button>
        </div>
      </div>
    </article>
  )
}
