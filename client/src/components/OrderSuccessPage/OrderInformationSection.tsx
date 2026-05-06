import type { OrderSuccessState } from "../../types/order"

export function OrderInformationSection({
  order,
}: {
  order: OrderSuccessState["order"]
}) {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold">Thông tin đơn hàng</h2>

      <div className="mt-4 space-y-3">
        {order?.items?.map((item) => (
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
                Số lượng: {item.quantity}
              </p>
            </div>

            <p className="font-semibold">{item.lineTotal}đ</p>
          </div>
        ))}
      </div>
    </section>
  )
}
