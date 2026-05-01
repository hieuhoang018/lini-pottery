import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import {
  cancelAdminOrder,
  getAdminOrders,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
} from "../../api/adminOrderApi"
import type { AdminOrder } from "../../types/admin"

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

  const handleCancel = async (orderId: string) => {
    const confirmed = window.confirm(
      "Cancel this order? Stock will be restored.",
    )

    if (!confirmed) return

    try {
      await cancelAdminOrder(orderId)
      toast.success("Order cancelled")
      fetchOrders()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel order")
    }
  }

  if (loading) {
    return <p className="text-stone-600">Loading orders...</p>
  }

  return (
    <section className="space-y-5">
      {orders.length === 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <p className="text-stone-600">No orders yet.</p>
        </div>
      )}

      {orders.map((order) => (
        <article
          key={order.id}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm text-stone-500">Order ID</p>
              <h2 className="font-semibold">{order.id}</h2>

              <p className="mt-3 text-sm text-stone-500">Customer</p>
              <p className="font-medium">
                {order.guestName || order.userId || "Registered user"}
              </p>

              {order.guestPhone && (
                <p className="text-sm text-stone-600">{order.guestPhone}</p>
              )}

              {order.guestEmail && (
                <p className="text-sm text-stone-600">{order.guestEmail}</p>
              )}
            </div>

            <div className="text-left lg:text-right">
              <p className="text-sm text-stone-500">Total</p>
              <p className="text-xl font-bold">€{order.totalAmount}</p>

              <p className="mt-2 text-sm text-stone-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              Order status
              <select
                value={order.status}
                onChange={(e) =>
                  handleStatusChange(
                    order.id,
                    e.target.value as AdminOrder["status"],
                  )
                }
                className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-stone-700">
              Payment status
              <select
                value={order.paymentStatus}
                onChange={(e) =>
                  handlePaymentChange(
                    order.id,
                    e.target.value as AdminOrder["paymentStatus"],
                  )
                }
                className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
              >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </label>
          </div>

          <div className="mt-5 rounded-xl bg-stone-50 p-4">
            <h3 className="font-semibold">Items</h3>

            <div className="mt-3 space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span>
                    {item.productName} × {item.quantity}
                  </span>
                  <span>€{item.lineTotal}</span>
                </div>
              ))}
            </div>
          </div>

          {order.address && (
            <div className="mt-5 rounded-xl bg-stone-50 p-4 text-sm">
              <h3 className="font-semibold">Shipping address</h3>
              <p className="mt-2">{order.address.recipientName}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.streetAddress}</p>
              <p>
                {order.address.postalCode} {order.address.city}
              </p>
              <p>{order.address.country}</p>
              {order.address.additionalInfo && (
                <p className="mt-2 text-stone-600">
                  {order.address.additionalInfo}
                </p>
              )}
            </div>
          )}

          {order.status !== "CANCELLED" && (
            <button
              onClick={() => handleCancel(order.id)}
              className="mt-5 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Cancel order and restore stock
            </button>
          )}
        </article>
      ))}
    </section>
  )
}
