import type { Order } from "../../types/order"

export function OrderSummarySection({ order }: { order: Order }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <h2 className="text-lg font-semibold">Tóm tắt</h2>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-stone-600">Thành tiền</span>
          <span className="font-medium">{order.subtotalAmount}đ</span>
        </div>

        <div className="flex justify-between">
          <span className="text-stone-600">Phí giao hàng</span>
          <span className="font-medium">{order.shippingFee}đ</span>
        </div>

        <div className="flex justify-between border-t border-stone-200 pt-3 text-base">
          <span className="font-semibold">Tổng cộng</span>
          <span className="font-bold">{order.totalAmount}đ</span>
        </div>
      </div>

      {order.paymentStatus === "PENDING" && (
        <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          <h3 className="font-semibold">Đang chờ thanh toán</h3>
          <p className="mt-2">
            Vui lòng hoàn tất chuyển khoản ngân hàng bằng mã QR hoặc thông tin
            ngân hàng. Quản trị viên sẽ xác nhận thanh toán sau khi nhận được.
          </p>
        </div>
      )}
    </div>
  )
}
