import { Link } from "react-router-dom"
import type { AdminOrder } from "../../types/admin"

export function OrderTitleCard({ order }: { order: AdminOrder }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <Link
        to="/orders"
        className="mb-6 inline-block text-sm font-semibold text-amber-800"
      >
        ← Quay về danh sách đơn hàng
      </Link>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Chi tiết đơn hàng</h2>
          <p className="mt-2 text-sm text-stone-500">{order.orderCode}</p>
          <p className="mt-1 text-sm text-stone-500">
            Thời gian tạo: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-sm text-stone-500">Tổng cộng</p>
          <p className="text-2xl font-bold">{order.totalAmount}đ</p>
        </div>
      </div>
    </div>
  )
}
