import { NavLink, Outlet } from "react-router-dom"

export function AdminLayout() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "rounded-xl bg-amber-800 px-4 py-2 font-semibold text-white"
      : "rounded-xl px-4 py-2 font-medium text-stone-700 hover:bg-stone-100"

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-8 text-stone-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Trang tổng quan cho quản trị viên
          </h1>
          <p className="mt-2 text-stone-600">
            Quản lý sản phẩm, đơn đặt hàng, thanh toán và hàng tồn kho.
          </p>
        </div>

        <div className="mb-8 flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-stone-200">
          <NavLink to="/admin/orders" className={linkClass}>
            Đơn hàng
          </NavLink>

          <NavLink to="/admin/products" className={linkClass}>
            Sản phẩm
          </NavLink>

          <NavLink to="/admin/categories" className={linkClass}>
            Phân loại
          </NavLink>
        </div>

        <Outlet />
      </div>
    </main>
  )
}
