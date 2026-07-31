import { Link, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { getMyOrderById } from "../api/orderApi"
import type { Order } from "../types/order"
import { OrderTitleCard } from "../components/OrderDetailPage/OrderTitleCard"
import { OrderInformationSection } from "../components/OrderDetailPage/OrderInformationSection"
import { AddressCard } from "../components/AddressCard"
import { OrderSummarySection } from "../components/OrderDetailPage/OrderSummarySection"
import { OrderPaymentRecords } from "../components/OrderDetailPage/OrderPaymentRecords"
import { useApiFetch } from "../hooks/useApiFetch"
import { OrderDetailSkeleton } from "../components/skeletons/OrderDetailSkeleton"

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: order, loading } = useApiFetch<Order>(async () => {
    if (!id) {
      throw new Error("Order id is missing")
    }

    return getMyOrderById(id)
  }, [id])

if (loading) {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <OrderDetailSkeleton />
    </main>
  )
}

  if (!order) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <p className="text-stone-600">Không tìm thấy đơn hàng.</p>

          <Link
            to="/orders"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-800 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-900"
          >
            <ArrowLeft size={18} />
            Quay về trang đơn hàng
          </Link>
        </div>
      </main>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-amber-800"
      >
        <ArrowLeft size={18} />
        Quay về trang đơn hàng
      </Link>

      <OrderTitleCard order={order} />

      <OrderInformationSection order={order} />

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <AddressCard
          address={order.address}
          title="Địa chỉ giao hàng"
          emptyMessage="Không có địa chỉ giao hàng."
        />

        <OrderSummarySection order={order} />
      </section>

      {order.paymentRecords.length > 0 && <OrderPaymentRecords order={order} />}
    </div>
  )
}
