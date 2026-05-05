import type { OrderSuccessState } from "../../types/order"

export function OrderAddressSection({
  order,
}: {
  order: OrderSuccessState["order"]
}) {
  return (
    <section className="mt-6 rounded-2xl bg-stone-50 p-5 text-sm text-stone-700">
      <h2 className="text-lg font-semibold text-stone-900">
        Thông tin giao hàng
      </h2>

      <p className="mt-3 font-medium">{order?.address?.recipientName}</p>
      <p>{order?.address?.phone}</p>
      <p>{order?.address?.streetAddress}</p>
      <p>
        {order?.address?.postalCode} {order?.address?.city}
      </p>
      <p>{order?.address?.country}</p>
    </section>
  )
}
