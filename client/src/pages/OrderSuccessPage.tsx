import { Link, useLocation } from "react-router-dom"
import type { OrderSuccessState } from "../types/order"
import { useAuth } from "../contexts/AuthContext"

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
          <h1 className="text-3xl font-bold">Order information unavailable</h1>

          <p className="mt-4 text-stone-600">
            We could not find order details on this page. This can happen if the
            page was refreshed.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900"
            >
              Continue shopping
            </Link>

            {user && (
              <Link
                to="/orders"
                className="rounded-full border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-800 hover:bg-stone-100"
              >
                View my orders
              </Link>
            )}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-stone-900">
      <div className="mx-auto max-w-4xl">
        <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-2xl text-green-700">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-bold">Đặt hàng thành công</h1>

          <p className="mt-3 text-stone-600">
            Cảm ơn bạn đã đặt hàng. Sản phẩm của bạn đã được giữ và đang chờ
            thanh toán.
          </p>

          <div className="mt-6 rounded-2xl bg-stone-50 p-5">
            <p className="text-sm text-stone-500">ID Đơn hàng</p>
            <p className="mt-1 break-all font-semibold">{order.id}</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-stone-500">Trạng thái đơn hàng</p>
                <p className="mt-1 font-semibold">{order.status}</p>
              </div>

              <div>
                <p className="text-sm text-stone-500">Trạng thái thanh toán</p>
                <p className="mt-1 font-semibold">{order.paymentStatus}</p>
              </div>

              <div>
                <p className="text-sm text-stone-500">Tổng cộng</p>
                <p className="mt-1 font-semibold">{order.totalAmount}đ</p>
              </div>
            </div>
          </div>

          <section className="mt-6 rounded-2xl bg-amber-50 p-5 text-amber-950">
            <h2 className="text-lg font-semibold">Hướng dẫn thanh toán</h2>

            <p className="mt-2 text-sm">
              {paymentInstruction?.note ||
                "Vui lòng quét mã QR hoặc chuyển khoản vào tài khoản ngân hàng được cung cấp. Quản trị viên sẽ xác nhận thanh toán thủ công."}
            </p>

            <div className="mt-5 rounded-2xl border border-dashed border-amber-300 bg-white p-6 text-center">
              <p className="font-semibold">Bank QR code placeholder</p>
              <p className="mt-2 text-sm text-stone-600">
                Add your real bank QR image here later.
              </p>
            </div>

            <div className="mt-5 rounded-xl bg-white p-4 text-sm text-stone-700">
              <p>
                <span className="font-semibold">Phương thức thanh toán:</span>{" "}
                {paymentInstruction?.method || "BANK_QR"}
              </p>
              {/* <p className="mt-2">
                <span className="font-semibold">Reference:</span> Please include
                your order ID in the transfer message.
              </p> */}
            </div>
          </section>

          {order.items && order.items.length > 0 && (
            <section className="mt-6">
              <h2 className="text-lg font-semibold">Thông tin đơn hàng</h2>

              <div className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl bg-stone-50 p-4"
                  >
                    <img
                      src={item.productImageUrl || "/placeholder.png"}
                      alt={item.productName}
                      className="h-16 w-16 rounded-xl bg-stone-200 object-cover"
                    />

                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-stone-500">
                        Số lượng: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold">{item.lineTotal}đ</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {order.address && (
            <section className="mt-6 rounded-2xl bg-stone-50 p-5 text-sm text-stone-700">
              <h2 className="text-lg font-semibold text-stone-900">
                Thông tin giao hàng
              </h2>

              <p className="mt-3 font-medium">{order.address.recipientName}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.streetAddress}</p>
              <p>
                {order.address.postalCode} {order.address.city}
              </p>
              <p>{order.address.country}</p>
            </section>
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
    </main>
  )
}
