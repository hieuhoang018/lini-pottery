import type { AdminOrder } from "../../types/admin"

export function OrderDetails({ order }: { order: AdminOrder }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <h3 className="text-xl font-semibold">Đơn hàng</h3>

      <div className="mt-5 space-y-4">
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
                €{item.productPrice} × {item.quantity}
              </p>
            </div>

            <p className="font-semibold">{item.lineTotal}đ</p>
          </div>
        ))}
      </div>
    </div>
  )
}
