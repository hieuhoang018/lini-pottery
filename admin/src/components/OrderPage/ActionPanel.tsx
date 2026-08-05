import type { AdminOrder } from "../../types/admin"

type ActionPanelProps = {
  updating: boolean
  order: AdminOrder
  handleStatusChange: (status: AdminOrder["status"]) => void
  handlePaymentChange: (status: AdminOrder["paymentStatus"]) => void
  handleCancel: () => void
}

export function ActionPanel({
  updating,
  order,
  handleStatusChange,
  handlePaymentChange,
  handleCancel,
}: ActionPanelProps) {
  return (
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
            handlePaymentChange(e.target.value as AdminOrder["paymentStatus"])
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
  )
}
