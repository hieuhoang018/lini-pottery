import { Link, useLocation } from "react-router-dom"
import type { OrderSuccessState } from "../types/order"
import { useAuth } from "../contexts/AuthContext"
import { OrderStatusCard } from "../components/OrderSuccessPage/OrderStatusCard"
import { PaymentInstructions } from "../components/OrderSuccessPage/PaymentInstruction"
import { OrderInformationSection } from "../components/OrderSuccessPage/OrderInformationSection"
import { AddressCard } from "../components/AddressCard"

export function OrderSuccessPage() {
  const location = useLocation()
  const state = location.state as OrderSuccessState | null
  const { user } = useAuth()

  const order = state?.order
  const paymentInstruction = state?.paymentInstruction

  if (!order) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10 text-stone-900">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <h1 className="text-3xl font-bold">Không tìm thấy đơn hàng</h1>

          <p className="mt-4 text-stone-600">
            Chúng tôi không tìm thấy chi tiết đơn hàng trên trang này. Điều này
            có thể xảy ra nếu trang đã được làm mới.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900"
            >
              Tiếp tục mua hàng
            </Link>

            {user && (
              <Link
                to="/orders"
                className="rounded-full border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-800 hover:bg-stone-100"
              >
                Xem các đơn hàng của tôi
              </Link>
            )}
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-2xl text-green-700">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold">Đặt hàng thành công</h1>

        <p className="mt-3 text-stone-600">
          Cảm ơn bạn đã đặt hàng. Sản phẩm của bạn đã được giữ và đang chờ thanh
          toán.
        </p>

        <OrderStatusCard order={order} />

        <PaymentInstructions paymentInstruction={paymentInstruction} />

        {order.items && order.items.length > 0 && (
          <OrderInformationSection order={order} />
        )}

        {order.address && (
          <AddressCard
            address={order.address}
            title="Thông tin giao hàng"
            variant="plain"
          />
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900"
          >
            Tiếp tục mua sắm
          </Link>

          {user && (
            <Link
              to="/orders"
              className="rounded-full border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-800 hover:bg-stone-100"
            >
              Xem các đơn hàng của tôi
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
