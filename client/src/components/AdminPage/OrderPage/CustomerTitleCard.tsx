import type { AdminOrder } from "../../../types/admin"
import {
  getCustomerEmail,
  getCustomerName,
  getCustomerPhone,
} from "../../../utils/getCustomerDetail"

export function CustomerTitleCard({ order }: { order: AdminOrder }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <h3 className="text-xl font-semibold">Khách hàng</h3>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
        <div>
          <p className="text-stone-500">Tên</p>
          <p className="font-medium">{getCustomerName(order)}</p>
        </div>

        <div>
          <p className="text-stone-500">Email</p>
          <p className="font-medium">{getCustomerEmail(order)}</p>
        </div>

        <div>
          <p className="text-stone-500">Số điện thoại</p>
          <p className="font-medium">{getCustomerPhone(order)}</p>
        </div>
      </div>
    </div>
  )
}
