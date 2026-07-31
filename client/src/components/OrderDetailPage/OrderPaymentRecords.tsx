import type { Order } from "../../types/order"
import { getPaymentRecordStatusBadgeClass } from "../../utils/getStatusBadgeClass"

export function OrderPaymentRecords({ order }: { order: Order }) {
  return (
    <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <h2 className="text-lg font-semibold">Lịch sử trạng thái thanh toán</h2>

      <div className="mt-4 space-y-3">
        {order.paymentRecords.map((record) => (
          <div
            key={record.id}
            className="rounded-xl bg-stone-50 p-4 text-sm text-stone-700"
          >
            <div className="flex flex-wrap justify-between gap-2">
              <span className="font-medium">{record.method}</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentRecordStatusBadgeClass(
                  record.status,
                )}`}
              >
                {record.status}
              </span>
            </div>

            {record.referenceNote && (
              <p className="mt-2 text-stone-600">{record.referenceNote}</p>
            )}

            {record.paidAt && (
              <p className="mt-2 text-stone-500">
                Đã thanh toán lúc: {new Date(record.paidAt).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
