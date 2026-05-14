import { Link } from "react-router-dom"
import type { AdminOrder } from "../../../types/admin"
import { getCustomerName } from "../../../utils/getCustomerDetail"

type OrderListProps = {
  orders: AdminOrder[]
  handleStatusChange: (orderId: string, status: AdminOrder["status"]) => void
  handlePaymentChange: (
    orderId: string,
    paymentStatus: AdminOrder["paymentStatus"],
  ) => void
}

export function OrderList({
  orders,
  handleStatusChange,
  handlePaymentChange,
}: OrderListProps) {
  return (
    <>
      <p className="mb-4 text-sm text-stone-600">
        Showing{" "}
        <span className="font-semibold text-stone-900">{orders.length}</span>{" "}
        order{orders.length === 1 ? "" : "s"}
      </p>

      <div className="space-y-4">
        {/* Order cards */}
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200"
          >
            <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr_1fr_auto] lg:items-center">
              <div>
                <p className="text-sm text-stone-500">Khách hàng</p>
                <h3 className="font-semibold text-stone-900">
                  {getCustomerName(order)}
                </h3>

                <p className="mt-2 text-xs text-stone-500">
                  ID Đơn hàng: {order.orderCode}
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <label className="block text-sm font-medium text-stone-700">
                Trạng thái đơn hàng
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(
                      order.id,
                      e.target.value as AdminOrder["status"],
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2"
                >
                  <option value="PENDING">ĐANG CHỜ</option>
                  <option value="CONFIRMED">ĐÃ XÁC NHẬN</option>
                  <option value="SHIPPED">ĐÃ GIAO HÀNG</option>
                  <option value="DELIVERED">ĐÃ NHẬN HÀNG</option>
                  <option value="CANCELLED">ĐÃ HỦY</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-stone-700">
                Trạng thái thanh toán
                <select
                  value={order.paymentStatus}
                  onChange={(e) =>
                    handlePaymentChange(
                      order.id,
                      e.target.value as AdminOrder["paymentStatus"],
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2"
                >
                  <option value="PENDING">ĐANG CHỜ</option>
                  <option value="PAID">ĐÃ THANH TOÁN</option>
                  <option value="CANCELLED">ĐÃ HỦY</option>
                </select>
              </label>

              <div className="flex flex-col gap-3 lg:items-end">
                <p className="text-xl font-bold">{order.totalAmount}đ</p>

                <Link
                  to={`/admin/orders/${order.id}`}
                  className="rounded-full border border-stone-300 bg-white px-4 py-2 text-center text-sm font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Quản lý
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
