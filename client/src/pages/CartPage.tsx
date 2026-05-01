import { Link } from "react-router-dom"
import { useCart } from "../contexts/CartContext"

export function CartPage() {
  const { items, loading, total, updateQuantity, removeFromCart, clearCart } =
    useCart()

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-5xl text-stone-600">Loading cart...</div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-stone-900">Your cart</h1>
          <p className="mt-4 text-stone-600">Your cart is empty.</p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-amber-800 px-6 py-3 font-semibold text-white"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-stone-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your cart</h1>

          <button
            onClick={clearCart}
            className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Clear cart
          </button>
        </div>

        <section className="space-y-4">
          {items.map((item) => {
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
                    <p className="mt-1 text-sm text-stone-500">
                      €{item.product.price}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="h-8 w-8 rounded-full border border-stone-300 bg-white"
                      >
                        -
                      </button>

                      <span className="w-8 text-center">{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="h-8 w-8 rounded-full border border-stone-300 bg-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-sm font-semibold text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </section>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>

          <Link
            to="/checkout"
            className="mt-6 block w-full rounded-full bg-amber-800 px-6 py-3 text-center font-semibold text-white hover:bg-amber-900"
          >
            Proceed to checkout
          </Link>
        </section>
      </div>
    </main>
  )
}
