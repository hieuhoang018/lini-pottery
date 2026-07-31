import { useState } from "react"
import toast from "react-hot-toast"
import {
  getAdminOrders,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,
} from "../../api/adminOrderApi"
import type {
  AdminOrder,
  OrderStatusFilter,
  PaymentStatusFilter,
} from "../../types/admin"
import { useDebounce } from "../../hooks/useDebounce"
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch"
import { getErrorMessage } from "../../utils/getErrorMessage"
import { OrderList } from "../../components/AdminPage/OrderPage/OrderList"
import { PaginationButtons } from "../../components/PaginationButtons"
import { SearchInput } from "../../components/SearchInput"
import { AdminOrdersSkeletonLoading } from "../../components/skeletons/AdminOrdersSkeletonLoading"

export function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("")
  const [paymentStatusFilter, setPaymentStatusFilter] =
    useState<PaymentStatusFilter>("")
  const limit = 20

  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 400)

  const {
    data: orders,
    pagination,
    loading,
    refetch,
    setPage,
  } = usePaginatedFetch<AdminOrder[]>(
    (page) =>
      getAdminOrders({
        search: debouncedSearchTerm || undefined,
        status: statusFilter || undefined,
        paymentStatus: paymentStatusFilter || undefined,
        page,
        limit,
      }),
    [debouncedSearchTerm, statusFilter, paymentStatusFilter],
  )

  const handleStatusChange = async (
    orderId: string,
    status: AdminOrder["status"],
  ) => {
    try {
      await updateAdminOrderStatus(orderId, status)
      toast.success("Order status updated")
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update status"))
    }
  }

  const handlePaymentChange = async (
    orderId: string,
    paymentStatus: AdminOrder["paymentStatus"],
  ) => {
    try {
      await updateAdminPaymentStatus(orderId, paymentStatus)
      toast.success("Payment status updated")
      refetch()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update payment"))
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("")
    setPaymentStatusFilter("")
  }

  const safeOrders = orders ?? []

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
          onClick={refetch}
          className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-stone-100"
        >
          Làm mới
        </button>
      </div>

      <section className="mb-5 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto_auto]">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Tìm kiếm đơn hàng theo khách hàng, sản phẩm, thành phố, số điện thoại..."
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as OrderStatusFilter)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Đang chờ</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="SHIPPED">Đã giao</option>
            <option value="DELIVERED">Đã nhận</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>

          <select
            value={paymentStatusFilter}
            onChange={(event) =>
              setPaymentStatusFilter(event.target.value as PaymentStatusFilter)
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Đang chờ</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>

          <button
            onClick={clearFilters}
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100"
          >
            Xóa bộ lọc
          </button>
        </div>
      </section>

      {loading ? (
        <AdminOrdersSkeletonLoading />
      ) : safeOrders.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <p className="text-stone-600">Không tìm thấy đơn hàng nào.</p>
        </div>
      ) : (
        <OrderList
          orders={safeOrders}
          handlePaymentChange={handlePaymentChange}
          handleStatusChange={handleStatusChange}
        />
      )}

      {!loading && pagination && (
        <PaginationButtons pagination={pagination} onPageChange={setPage} />
      )}
    </section>
  )
}
