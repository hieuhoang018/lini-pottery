import { useState } from "react"
import toast from "react-hot-toast"
import { Link, useParams } from "react-router-dom"
import {
  cancelAdminOrder,
  getAdminOrderById,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
} from "../../api/adminOrderApi"
import type { AdminOrder } from "../../types/admin"
import { useApiFetch } from "../../hooks/useApiFetch"
import { OrderTitleCard } from "../../components/AdminPage/OrderPage/OrderTitleCard"
import { CustomerTitleCard } from "../../components/AdminPage/OrderPage/CustomerTitleCard"
import { OrderDetails } from "../../components/AdminPage/OrderPage/OrderDetails"
import { AddressCard } from "../../components/AddressCard"
import { getErrorMessage } from "../../utils/getErrorMessage"
import { PaymentRecords } from "../../components/AdminPage/OrderPage/PaymentRecords"
import { ActionPanel } from "../../components/AdminPage/OrderPage/ActionPanel"
import { SummarySection } from "../../components/AdminPage/OrderPage/SummarySection"
import { AdminOrderDetailSkeleton } from "../../components/skeletons/AdminOrderDetailSkeletonLoading"

export function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()

  const [updating, setUpdating] = useState(false)

  const {
    data: order,
    loading,
    refetch,
  } = useApiFetch<AdminOrder>(async () => {
    if (!id) {
      throw new Error("Order id is missing")
    }

    return getAdminOrderById(id)
  }, [id])

  const handleStatusChange = async (status: AdminOrder["status"]) => {
    if (!order) return

    try {
      setUpdating(true)
      await updateAdminOrderStatus(order.id, status)
      toast.success("Order status updated")
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update status"))
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
      await updateAdminPaymentStatus(order.id, paymentStatus)
      toast.success("Payment status updated")
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update payment"))
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = async () => {
    if (!order) return

    const confirmed = window.confirm(
      "Xác nhận hủy đơn hàng? Số hàng tồn kho sẽ được bổ sung",
    )

    if (!confirmed) return

    try {
      setUpdating(true)
      await cancelAdminOrder(order.id)
      toast.success("Order cancelled and stock restored")
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to cancel order"))
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <AdminOrderDetailSkeleton />
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
        <OrderTitleCard order={order} />

        <CustomerTitleCard order={order} />

        <OrderDetails order={order} />

        {order.address && (
          <AddressCard
            address={order.address}
            title="Thông tin giao hàng"
            headingLevel="h3"
          />
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
            <PaymentRecords order={order} />
          )}
        </div>
      </div>

      <aside className="h-fit space-y-6">
        <ActionPanel
          updating={updating}
          order={order}
          handleCancel={handleCancel}
          handlePaymentChange={handlePaymentChange}
          handleStatusChange={handleStatusChange}
        />

        <SummarySection order={order} />
      </aside>
    </section>
  )
}
