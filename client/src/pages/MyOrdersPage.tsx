import { MainOrdersSection } from "../components/OrdersPage/MainOrdersSection"

export function MyOrdersPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>
          <p className="mt-2 text-sm text-stone-600">
            Tìm kiếm đơn hàng theo sản phẩm, thành phố, số điện thoại hoặc trạng
            thái.
          </p>
        </div>
      </div>

      <MainOrdersSection />
    </div>
  )
}
