import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { Search } from "lucide-react"
import { getMyOrders } from "../api/orderApi"
import type { Order } from "../types/order"

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
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
    }, 400)

    return () => window.clearTimeout(timeoutId)
  }, [searchTerm])

  const fetchOrders = async () => {
    try {
      setLoading(true)

      const data = await getMyOrders({
        search: debouncedSearchTerm || undefined,
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
  }, [debouncedSearchTerm])

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-stone-900">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>
            <p className="mt-2 text-sm text-stone-600">
              Tìm kiếm đơn hàng theo sản phẩm, thành phố, số điện thoại hoặc
              trạng thái.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-stone-100"
          >
            Refresh
          </button>
        </div>

        <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="text"
              placeholder="Search your orders..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-xl border border-stone-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("")
                setDebouncedSearchTerm("")
              }}
              className="mt-3 rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100"
            >
              Clear search
            </button>
          )}
        </section>

        {loading ? (
          <div className="mt-8 text-stone-600">Loading orders...</div>
        ) : orders.length === 0 ? (
          <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <p className="text-stone-600">
              {debouncedSearchTerm
                ? "Không tìm thấy đơn hàng phù hợp."
                : "Bạn chưa có đơn hàng nào."}
            </p>

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
        )}
      </div>
    </main>
  )
}
