import { Link, NavLink, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useAuth } from "../../contexts/AuthContext"
import {
  Heart,
  LogOut,
  ReceiptText,
  ShoppingCart,
  Store,
  User,
  UserStar,
} from "lucide-react"

export function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "font-semibold text-amber-800"
      : "font-medium text-stone-700 hover:text-amber-800"

  const handleLogout = () => {
    logout()
    toast.success("Logged out")
    navigate("/")
  }

  return (
    <header className="border-b border-stone-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
        <Link to="/" className="inline-flex items-center">
          <img src="/logo.png" alt="Lini Pottery" className="h-17 w-auto" />
        </Link>

        <div className="flex items-center gap-6">
          <NavLink to="/" className={linkClass}>
            <Store />
          </NavLink>

          <NavLink to="/cart" className={linkClass}>
            <ShoppingCart />
          </NavLink>

          {!user ? (
            <>
              <NavLink to="/login" className={linkClass}>
                <User />
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/wishlist" className={linkClass}>
                <Heart />
              </NavLink>
              <NavLink to="/orders" className={linkClass}>
                <ReceiptText />
              </NavLink>
              {user.role === "ADMIN" && (
                <NavLink to="/admin/orders" className={linkClass}>
                  <UserStar />
                </NavLink>
              )}
              <button
                onClick={handleLogout}
                className="font-medium text-stone-700 hover:text-amber-800"
              >
                <LogOut />
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
