import type { OrderSuccessState } from "../../types/order"

export function OrderStatusCard({
  order,
}: {
  order: OrderSuccessState["order"]
}) {
  if (!order) {
    return <p>Có lỗi trong việc tải trạng thái đơn hàng</p>
  }

  return (
    <div className="mt-6 rounded-2xl bg-stone-50 p-5">
      <p className="text-sm text-stone-500">ID Đơn hàng</p>
      <p className="mt-1 break-all font-semibold">{order.id}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-stone-500">Trạng thái đơn hàng</p>
          <p className="mt-1 font-semibold">{order.status}</p>
        </div>

        <div>
          <p className="text-sm text-stone-500">Trạng thái thanh toán</p>
          <p className="mt-1 font-semibold">{order.paymentStatus}</p>
        </div>

        <div>
          <p className="text-sm text-stone-500">Tổng cộng</p>
          <p className="mt-1 font-semibold">{order.totalAmount}đ</p>
        </div>
      </div>
    </div>
  )
}
