import type { Order } from "../../types/order"

export function OrderAddressSection({ order }: { order: Order }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <h2 className="text-lg font-semibold">Địa chỉ giao hàng</h2>

      {order.address ? (
        <div className="mt-4 space-y-1 text-sm text-stone-700">
          <p className="font-medium">{order.address.recipientName}</p>
          <p>{order.address.phone}</p>
          <p>{order.address.streetAddress}</p>
          <p>
            {order.address.postalCode} {order.address.city}
          </p>
          <p>{order.address.country}</p>

          {order.address.additionalInfo && (
            <p className="pt-2 text-stone-600">
              {order.address.additionalInfo}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm text-stone-600">
          Không có địa chỉ giao hàng.
        </p>
      )}
    </div>
  )
}
