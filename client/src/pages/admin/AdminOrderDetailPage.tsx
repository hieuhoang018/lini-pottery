import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link, useParams } from "react-router-dom"
import {
  cancelAdminOrder,
  getAdminOrderById,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
} from "../../api/adminOrderApi"
import type { AdminOrder } from "../../types/admin"

function getCustomerName(order: AdminOrder) {
  return order.user?.name || order.guestName || "Guest customer"
}

function getCustomerEmail(order: AdminOrder) {
  return order.user?.email || order.guestEmail || "No email provided"
}

function getCustomerPhone(order: AdminOrder) {
  return order.user?.phone || order.guestPhone || "No phone provided"
}

export function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()

  const [order, setOrder] = useState<AdminOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const fetchOrder = async () => {
    if (!id) return

    try {
      setLoading(true)
      const data = await getAdminOrderById(id)
      setOrder(data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load order")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [id])

  const handleStatusChange = async (status: AdminOrder["status"]) => {
    if (!order) return

    try {
      setUpdating(true)
      const updated = await updateAdminOrderStatus(order.id, status)
      setOrder(updated)
      toast.success("Order status updated")
      fetchOrder()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status")
    } finally {
      setUpdating(false)
    }
  }

  const handlePaymentChange = async (
    paymentStatus: AdminOrder["paymentStatus"],
  ) => {
    if (!order) return

    try {
      setUpdating(true)
      const updated = await updateAdminPaymentStatus(order.id, paymentStatus)
      setOrder(updated)
      toast.success("Payment status updated")
      fetchOrder()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update payment")
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = async () => {
    if (!order) return

    const confirmed = window.confirm(
      "Cancel this order? Stock will be restored.",
    )

    if (!confirmed) return

    try {
      setUpdating(true)
      const updated = await cancelAdminOrder(order.id)
      setOrder(updated)
      toast.success("Order cancelled and stock restored")
      fetchOrder()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel order")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <p className="text-stone-600">Loading order...</p>
  }

  if (!order) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <p className="text-stone-600">Không tìm được đơn hàng.</p>
        <Link
          to="/admin/orders"
          className="mt-4 inline-block text-amber-800 underline"
        >
          Quay về danh sách đơn hàng
        </Link>
      </div>
    )
  }

  return (
    <section className="grid gap-8 xl:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <Link
            to="/admin/orders"
            className="mb-6 inline-block text-sm font-semibold text-amber-800"
          >
            ← Quay về danh sách đơn hàng
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Chi tiết đơn hàng</h2>
              <p className="mt-2 text-sm text-stone-500">{order.id}</p>
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

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h3 className="text-xl font-semibold">Khách hàng</h3>

          <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
            <div>
              <p className="text-stone-500">Tên</p>
              <p className="font-medium">{getCustomerName(order)}</p>
            </div>

            <div>
              <p className="text-stone-500">Email</p>
              <p className="font-medium">{getCustomerEmail(order)}</p>
            </div>

            <div>
              <p className="text-stone-500">Số điện thoại</p>
              <p className="font-medium">{getCustomerPhone(order)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h3 className="text-xl font-semibold">Đơn hàng</h3>

          <div className="mt-5 space-y-4">
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
                    €{item.productPrice} × {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">{item.lineTotal}đ</p>
              </div>
            ))}
          </div>
        </div>

        {order.address && (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <h3 className="text-xl font-semibold">Thông tin giao hàng</h3>

            <div className="mt-4 text-sm text-stone-700">
              <p className="font-medium">{order.address.recipientName}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.streetAddress}</p>
              <p>
                {order.address.postalCode} {order.address.city}
              </p>
              <p>{order.address.country}</p>

              {order.address.additionalInfo && (
                <p className="mt-3 rounded-xl bg-stone-50 p-3 text-stone-600">
                  {order.address.additionalInfo}
                </p>
              )}
            </div>
          </div>
        )}

        {order.notes && (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <h3 className="text-xl font-semibold">Ghi chú khách hàng</h3>
            <p className="mt-4 text-sm text-stone-700">{order.notes}</p>
          </div>
        )}

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h3 className="text-xl font-semibold">Ghi chép thanh toán</h3>

          {!order.paymentRecords || order.paymentRecords.length === 0 ? (
            <p className="mt-4 text-sm text-stone-600">Chưa có ghi chép.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {order.paymentRecords.map((record) => (
                <div
                  key={record.id}
                  className="rounded-xl bg-stone-50 p-4 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium">{record.method}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        record.status === "CONFIRMED"
                          ? "bg-green-50 text-green-700"
                          : record.status === "REJECTED"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>

                  {record.referenceNote && (
                    <p className="mt-2 text-stone-600">
                      {record.referenceNote}
                    </p>
                  )}

                  {record.paidAt && (
                    <p className="mt-2 text-stone-500">
                      Paid at: {new Date(record.paidAt).toLocaleString()}
                    </p>
                  )}

                  <p className="mt-2 text-stone-500">
                    Created: {new Date(record.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <aside className="h-fit space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h3 className="text-xl font-semibold">Quản lý đơn hàng</h3>

          <label className="mt-5 block text-sm font-medium text-stone-700">
            Trạng thái đơn hàng
            <select
              disabled={updating}
              value={order.status}
              onChange={(e) =>
                handleStatusChange(e.target.value as AdminOrder["status"])
              }
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            >
              <option value="PENDING">ĐANG CHỜ</option>
              <option value="CONFIRMED">ĐÃ XÁC NHẬN</option>
              <option value="SHIPPED">ĐÃ GIAO HÀNG</option>
              <option value="DELIVERED">ĐÃ NHẬN HÀNG</option>
              <option value="CANCELLED">ĐÃ HỦY</option>
            </select>
          </label>

          <label className="mt-4 block text-sm font-medium text-stone-700">
            Trạng thái thanh toán
            <select
              disabled={updating}
              value={order.paymentStatus}
              onChange={(e) =>
                handlePaymentChange(
                  e.target.value as AdminOrder["paymentStatus"],
                )
              }
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            >
              <option value="PENDING">ĐANG CHỜ</option>
              <option value="PAID">ĐÃ THANH TOÁN</option>
              <option value="CANCELLED">ĐÃ HỦY</option>
            </select>
          </label>

          {order.status !== "CANCELLED" && (
            <button
              disabled={updating}
              onClick={handleCancel}
              className="mt-6 w-full rounded-full border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:bg-stone-100"
            >
              Hủy đơn hàng và khôi phục hàng tồn kho
            </button>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h3 className="text-xl font-semibold">Tóm tắt</h3>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-600">Thành tiền</span>
              <span>{order.subtotalAmount}đ</span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-600">Phí giao hàng</span>
              <span>{order.shippingFee}đ</span>
            </div>

            <div className="border-t border-stone-200 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span>{order.totalAmount}đ</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  )
}
