import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { getMyOrders } from "../api/orderApi"
import type { CustomerOrder } from "../types/order"

function getStatusBadgeClass(status: string) {
  if (status === "DELIVERED" || status === "PAID") {
    return "bg-green-50 text-green-700"
  }

  if (status === "CANCELLED") {
    return "bg-red-50 text-red-700"
  }

  if (status === "SHIPPED" || status === "CONFIRMED") {
    return "bg-blue-50 text-blue-700"
  }

  return "bg-amber-50 text-amber-700"
}

export function MyOrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await getMyOrders()
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

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-5xl text-stone-600">
          Loading orders...
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-stone-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>

        {orders.length === 0 ? (
          <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <p className="text-stone-600">Bạn chưa có đơn hàng nào.</p>

            <Link
              to="/"
              className="mt-6 inline-block rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900"
            >
              Tiếp tục mua sắm
            </Link>
          </section>
        ) : (
          <section className="mt-8 space-y-5">
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

                <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-5">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="text-xl font-bold">
                    {order.totalAmount}đ
                  </span>
                </div>

                {order.address && (
                  <div className="mt-5 rounded-xl bg-stone-50 p-4 text-sm text-stone-700">
                    <h3 className="font-semibold">Thông tin đơn hàng</h3>
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

                {order.paymentStatus === "PENDING" && (
                  <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                    <h3 className="font-semibold">Đang chờ thanh toán</h3>
                    <p className="mt-2">
                      Vui lòng hoàn tất chuyển khoản ngân hàng bằng mã QR. Quản
                      trị viên sẽ xác nhận khoản thanh toán của bạn sau khi nhận
                      được
                    </p>
                  </div>
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  )
}
