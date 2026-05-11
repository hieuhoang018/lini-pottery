import { Link } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import { Emptylist } from "../layout/EmptyList"
import { CartItemCard } from "./CartItemCard"
import { CartSkeletonLoading } from "../skeletons/CartSkeletonLoading"

export function MainCartSection() {
  const { items, loading, total, clearCart } = useCart()

  if (loading) {
    return <CartSkeletonLoading />
  }

  if (items.length === 0) {
    return <Emptylist subtitle="Giỏ hàng của bạn trống." />
  }

  return (
    <>
      <button
        onClick={clearCart}
        className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 mb-4"
      >
        Xóa giỏ hàng
      </button>

      <section className="space-y-4">
        {items.map((item) => {
          return <CartItemCard key={item.product.id} item={item} />
        })}
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Tổng cộng</span>
          <span>{total.toFixed()}đ</span>
        </div>

        <Link
          to="/checkout"
          className="mt-6 block w-full rounded-full bg-amber-800 px-6 py-3 text-center font-semibold text-white hover:bg-amber-900"
        >
          Thanh toán
        </Link>
      </section>
    </>
  )
}
