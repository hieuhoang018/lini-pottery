import type { AdminOrder } from "../../../types/admin"

export function SummarySection({ order }: { order: AdminOrder }) {
  return (
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
  )
}
