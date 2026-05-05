import type { Order } from "../../types/order"

export function OrderInformationSection({ order }: { order: Order }) {
  return (
    <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <h2 className="text-lg font-semibold">Đơn hàng</h2>

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
  )
}
