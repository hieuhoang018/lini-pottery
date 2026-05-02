import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import {
  getAdminOrders,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
} from "../../api/adminOrderApi"
import type { AdminOrder } from "../../types/admin"

function getCustomerName(order: AdminOrder) {
  return order.user?.name || order.guestName || "Guest customer"
}

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await getAdminOrders()
      setOrders(data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (
    orderId: string,
    status: AdminOrder["status"],
  ) => {
    try {
      await updateAdminOrderStatus(orderId, status)
      toast.success("Order status updated")
      fetchOrders()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status")
    }
  }

  const handlePaymentChange = async (
    orderId: string,
    paymentStatus: AdminOrder["paymentStatus"],
  ) => {
    try {
      await updateAdminPaymentStatus(orderId, paymentStatus)
      toast.success("Payment status updated")
      fetchOrders()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update payment")
    }
  }

  if (loading) {
    return <p className="text-stone-600">Loading orders...</p>
  }

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Đơn hàng</h2>
          <p className="mt-1 text-sm text-stone-600">
            Xem xét đơn hàng và cập nhật trạng thái.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-stone-100"
        >
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <p className="text-stone-600">Chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="space-y-4">
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
                    ID Đơn hàng: {order.id}
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
      )}
    </section>
  )
}
