import { LayoutDashboard } from "lucide-react"

export function DashboardPage() {
  return (
    <section className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-stone-200">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
        <LayoutDashboard className="h-7 w-7 text-stone-500" />
      </div>

      <h2 className="mt-4 text-xl font-semibold text-stone-900">
        Trang tổng quan
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
        Số liệu doanh thu và đơn hàng sẽ sớm xuất hiện ở đây. Trong lúc chờ,
        hãy dùng thanh điều hướng bên trái để quản lý đơn hàng, sản phẩm và
        phân loại.
      </p>
    </section>
  )
}
