import { Link } from "react-router-dom"
import type { Order } from "../../types/order"
import { getStatusBadgeClass } from "../../utils/getStatusBadgeClass"


export function OrdersList({ orders }: { orders: Order[] }) {
  return (
    <section className="mt-3 space-y-5">
      {orders.map((order) => (
        <article
          key={order.id}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-stone-500">ID Đơn hàng</p>
              <h2 className="font-semibold">{order.id}</h2>

              <p className="mt-2 text-sm text-stone-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                  order.status,
                )}`}
              >
                Đơn hàng: {order.status}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                  order.paymentStatus,
                )}`}
              >
                Thanh toán: {order.paymentStatus}
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-3">
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
                    {item.productPrice}đ × {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">{item.lineTotal}đ</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-4 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-semibold">Tổng cộng</span>
              <span className="ml-3 text-xl font-bold">
                {order.totalAmount}đ
              </span>
            </div>

            <Link
              to={`/orders/${order.id}`}
              className="rounded-full border border-stone-300 bg-white px-5 py-2 text-center text-sm font-semibold text-stone-700 hover:bg-stone-100"
            >
              Xem chi tiết
            </Link>
          </div>
        </article>
      ))}
    </section>
  )
}
