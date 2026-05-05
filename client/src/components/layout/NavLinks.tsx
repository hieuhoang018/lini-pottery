import { NavLink, useNavigate } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import {
  Heart,
  LogOut,
  ReceiptText,
  ShoppingCart,
  Store,
  User,
  UserStar,
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import toast from "react-hot-toast"
import { type Dispatch, type SetStateAction } from "react"

type NavLinksProps = {
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>
}

export function NavLinks({ setMobileMenuOpen }: NavLinksProps) {
  const navigate = useNavigate()
  const { items } = useCart()
  const { user, logout } = useAuth()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "flex items-center gap-2 rounded-lg px-3 py-2 font-semibold text-amber-800"
      : "flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-stone-700 hover:bg-stone-100 hover:text-amber-800"

  const handleLogout = () => {
    logout()
    toast.success("Đã đăng xuất")
    setMobileMenuOpen(false)
    navigate("/")
  }

  return (
    <>
      <NavLink
        to="/"
        className={linkClass}
        onClick={() => setMobileMenuOpen(false)}
      >
        <Store size={20} />
        <span>Cửa hàng</span>
      </NavLink>

      <NavLink
        to="/cart"
        className={linkClass}
        onClick={() => setMobileMenuOpen(false)}
      >
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
          <NavLink
            to="/login"
            className={linkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            <User size={20} />
            <span>Đăng nhập</span>
          </NavLink>
        </>
      ) : (
        <>
          <NavLink
            to="/wishlist"
            className={linkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Heart size={20} />
            <span>Yêu thích</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={linkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            <ReceiptText size={20} />
            <span>Đơn hàng</span>
          </NavLink>

          <span className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-stone-700">
            Xin chào, {user.name}
          </span>

          {user.role === "ADMIN" && (
            <NavLink
              to="/admin/orders"
              className={linkClass}
              onClick={() => setMobileMenuOpen(false)}
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
}
