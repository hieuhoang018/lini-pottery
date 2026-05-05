import type { Order } from "../../types/order"
import { getStatusBadgeClass } from "../../utils/getStatusBadgeClass"

export function OrderTitleCard({ order }: { order: Order }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm text-stone-500">ID Đơn hàng</p>
          <h1 className="mt-1 break-all text-2xl font-bold">{order.id}</h1>

          <p className="mt-2 text-sm text-stone-500">
            Đặt hàng vào ngày {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
              order.status,
            )}`}
          >
            Trạng thái: {order.status}
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
    </section>
  )
}
