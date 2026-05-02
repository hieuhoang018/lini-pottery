import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { Search } from "lucide-react"
import {
  getAdminOrders,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
} from "../../api/adminOrderApi"
import type { AdminOrder } from "../../types/admin"

type OrderStatusFilter =
  | ""
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"

type PaymentStatusFilter = "" | "PENDING" | "PAID" | "CANCELLED"

function getCustomerName(order: AdminOrder) {
  return order.user?.name || order.guestName || "Guest customer"
}

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("")
  const [paymentStatusFilter, setPaymentStatusFilter] =
    useState<PaymentStatusFilter>("")

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
    }, 400)

    return () => window.clearTimeout(timeoutId)
  }, [searchTerm])

  const fetchOrders = async () => {
    try {
      setLoading(true)

      const data = await getAdminOrders({
        search: debouncedSearchTerm || undefined,
        status: statusFilter || undefined,
        paymentStatus: paymentStatusFilter || undefined,
      })

      setOrders(data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [debouncedSearchTerm, statusFilter, paymentStatusFilter])

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

  const clearFilters = () => {
    setSearchTerm("")
    setDebouncedSearchTerm("")
    setStatusFilter("")
    setPaymentStatusFilter("")
  }

  return (
    <section>
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

      <section className="mb-5 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="text"
              placeholder="Search orders by customer, product, city, phone..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-xl border border-stone-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as OrderStatusFilter)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
          >
            <option value="">All order statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={paymentStatusFilter}
            onChange={(event) =>
              setPaymentStatusFilter(event.target.value as PaymentStatusFilter)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
          >
            <option value="">All payment statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            onClick={clearFilters}
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100"
          >
            Clear
          </button>
        </div>
      </section>

      {loading ? (
        <p className="text-stone-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <p className="text-stone-600">Không tìm thấy đơn hàng nào.</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-stone-600">
            Showing{" "}
            <span className="font-semibold text-stone-900">
              {orders.length}
            </span>{" "}
            order{orders.length === 1 ? "" : "s"}
          </p>

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
        </>
      )}
    </section>
  )
}
