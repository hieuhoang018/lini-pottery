import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import {
  Heart,
  LogOut,
  Menu,
  ReceiptText,
  ShoppingCart,
  Store,
  User,
  UserStar,
  X,
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useCart } from "../../contexts/CartContext"

export function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { items } = useCart()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "flex items-center gap-2 rounded-lg px-3 py-2 font-semibold text-amber-800"
      : "flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-stone-700 hover:bg-stone-100 hover:text-amber-800"

  const handleLogout = () => {
    logout()
    toast.success("Logged out")
    setMobileMenuOpen(false)
    navigate("/")
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const navLinks = (
    <>
      <NavLink to="/" className={linkClass} onClick={closeMobileMenu}>
        <Store size={20} />
        <span>Cửa hàng</span>
      </NavLink>

      <NavLink to="/cart" className={linkClass} onClick={closeMobileMenu}>
        <div className="relative">
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-700 px-1 text-xs font-semibold text-white">
              {cartCount}
            </span>
          )}
        </div>
        <span>Giỏ hàng</span>
      </NavLink>

      {!user ? (
        <>
          <NavLink to="/login" className={linkClass} onClick={closeMobileMenu}>
            <User size={20} />
            <span>Đăng nhập</span>
          </NavLink>
        </>
      ) : (
        <>
          <NavLink
            to="/wishlist"
            className={linkClass}
            onClick={closeMobileMenu}
          >
            <Heart size={20} />
            <span>Yêu thích</span>
          </NavLink>

          <NavLink to="/orders" className={linkClass} onClick={closeMobileMenu}>
            <ReceiptText size={20} />
            <span>Đơn hàng</span>
          </NavLink>

          <span className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-stone-700">
            Hi, {user.name}
          </span>

          {user.role === "ADMIN" && (
            <NavLink
              to="/admin/orders"
              className={linkClass}
              onClick={closeMobileMenu}
            >
              <UserStar size={20} />
              <span>Quản trị</span>
            </NavLink>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-stone-700 hover:bg-stone-100 hover:text-amber-800"
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-2">
          <Link to="/" className="inline-flex items-center">
            <img src="/logo.png" alt="Lini Pottery" className="h-16 w-auto" />
          </Link>

          <div className="hidden items-center gap-2 md:flex">{navLinks}</div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="rounded-lg p-2 text-stone-700 hover:bg-stone-100 hover:text-amber-800 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="flex flex-col gap-1 border-t border-stone-100 py-3 md:hidden">
            {navLinks}
          </div>
        )}
      </nav>
    </header>
  )
}
