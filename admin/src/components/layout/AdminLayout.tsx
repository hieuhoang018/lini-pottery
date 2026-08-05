import { useEffect, useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tags,
  LogOut,
  Menu,
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

const navItems = [
  { to: "/", label: "Tổng quan", icon: LayoutDashboard, end: true },
  { to: "/orders", label: "Đơn hàng", icon: ShoppingBag, end: false },
  { to: "/products", label: "Sản phẩm", icon: Package, end: false },
  { to: "/categories", label: "Phân loại", icon: Tags, end: false },
]

const isDesktopViewport = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(min-width: 768px)").matches

export function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(isDesktopViewport)

  useEffect(() => {
    if (!isDesktopViewport()) {
      setSidebarOpen(false)
    }
  }, [location.pathname])

  return (
    <div className="flex min-h-screen bg-stone-50 text-stone-900">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Đóng menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col overflow-hidden border-r border-stone-200 bg-white transition-all duration-200 ease-out md:static md:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:w-0 md:border-r-0"
        }`}
      >
        <div className="w-64 px-6 py-6">
          <p className="text-lg font-bold">Lini Admin</p>
        </div>

        <nav className="w-64 flex-1 space-y-1 px-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-stone-900 text-white"
                    : "text-stone-600 hover:bg-stone-100"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="w-64 border-t border-stone-200 p-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-stone-200 bg-white px-4 py-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label={sidebarOpen ? "Đóng menu" : "Mở menu"}
              onClick={() => setSidebarOpen((open) => !open)}
              className="shrink-0 text-stone-600 hover:text-stone-900"
            >
              <Menu size={22} />
            </button>

            <p className="hidden truncate text-sm text-stone-500 sm:block">
              Quản trị viên
            </p>
          </div>

          <p className="truncate text-sm font-medium text-stone-900">
            {user?.name}
          </p>
        </header>

        <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
