import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { getMyOrderById } from "../api/orderApi"
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

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchOrder = async () => {
      try {
        setLoading(true)
        const data = await getMyOrderById(id)
        setOrder(data)
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load order")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-5xl text-stone-600">Loading order...</div>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <p className="text-stone-600">Order not found.</p>

          <Link
            to="/orders"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-800 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-900"
          >
            <ArrowLeft size={18} />
            Back to orders
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-stone-900">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-amber-800"
        >
          <ArrowLeft size={18} />
          Back to orders
        </Link>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-stone-500">Order ID</p>
              <h1 className="mt-1 break-all text-2xl font-bold">{order.id}</h1>

              <p className="mt-2 text-sm text-stone-500">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                  order.status,
                )}`}
              >
                Order: {order.status}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                  order.paymentStatus,
                )}`}
              >
                Payment: {order.paymentStatus}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-lg font-semibold">Items</h2>

          <div className="mt-5 space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-xl bg-stone-50 p-4"
              >
                <img
                  src={item.productImageUrl || "/placeholder.png"}
                  alt={item.productName}
                  className="h-20 w-20 rounded-xl bg-stone-200 object-cover"
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
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <h2 className="text-lg font-semibold">Delivery address</h2>

            {order.address ? (
              <div className="mt-4 space-y-1 text-sm text-stone-700">
                <p className="font-medium">{order.address.recipientName}</p>
                <p>{order.address.phone}</p>
                <p>{order.address.streetAddress}</p>
                <p>
                  {order.address.postalCode} {order.address.city}
                </p>
                <p>{order.address.country}</p>

                {order.address.additionalInfo && (
                  <p className="pt-2 text-stone-600">
                    {order.address.additionalInfo}
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-stone-600">
                No delivery address found.
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <h2 className="text-lg font-semibold">Payment summary</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Subtotal</span>
                <span className="font-medium">{order.subtotalAmount}đ</span>
              </div>

              <div className="flex justify-between">
                <span className="text-stone-600">Shipping</span>
                <span className="font-medium">{order.shippingFee}đ</span>
              </div>

              <div className="flex justify-between border-t border-stone-200 pt-3 text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold">{order.totalAmount}đ</span>
              </div>
            </div>

            {order.paymentStatus === "PENDING" && (
              <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                <h3 className="font-semibold">Payment pending</h3>
                <p className="mt-2">
                  Please complete the bank transfer using the QR code or bank
                  details. Admin will confirm your payment after receiving it.
                </p>
              </div>
            )}
          </div>
        </section>

        {order.paymentRecords.length > 0 && (
          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <h2 className="text-lg font-semibold">Payment records</h2>

            <div className="mt-4 space-y-3">
              {order.paymentRecords.map((record) => (
                <div
                  key={record.id}
                  className="rounded-xl bg-stone-50 p-4 text-sm text-stone-700"
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="font-medium">{record.method}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                        record.status,
                      )}`}
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
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
