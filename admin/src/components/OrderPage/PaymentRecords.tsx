import type { AdminOrder } from "../../types/admin"
import { getPaymentRecordStatusBadgeClass } from "../../utils/getStatusBadgeClass"

export function PaymentRecords({ order }: { order: AdminOrder }) {
  return (
    <div className="mt-4 space-y-3">
      {order.paymentRecords?.map((record) => (
        <div key={record.id} className="rounded-xl bg-stone-50 p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-medium">{record.method}</p>
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
              Paid at: {new Date(record.paidAt).toLocaleString()}
            </p>
          )}

          <p className="mt-2 text-stone-500">
            Created: {new Date(record.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )
}
