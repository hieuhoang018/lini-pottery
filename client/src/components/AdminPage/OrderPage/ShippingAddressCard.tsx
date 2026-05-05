import type { AdminOrder } from "../../../types/admin"

export function ShippingAddressCard({ order }: { order: AdminOrder }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <h3 className="text-xl font-semibold">Thông tin giao hàng</h3>

      <div className="mt-4 text-sm text-stone-700">
        <p className="font-medium">{order.address?.recipientName}</p>
        <p>{order.address?.phone}</p>
        <p>{order.address?.streetAddress}</p>
        <p>
          {order.address?.postalCode} {order.address?.city}
        </p>
        <p>{order.address?.country}</p>

        {order.address?.additionalInfo && (
          <p className="mt-3 rounded-xl bg-stone-50 p-3 text-stone-600">
            {order.address?.additionalInfo}
          </p>
        )}
      </div>
    </div>
  )
}
