import { Link, NavLink, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useAuth } from "../../contexts/AuthContext"

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
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold text-stone-900">
          Lini Pottery
        </Link>

        <div className="flex items-center gap-6">
          <NavLink to="/" className={linkClass}>
            Shop
          </NavLink>

          <NavLink to="/cart" className={linkClass}>
            Cart
          </NavLink>

          {!user ? (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/wishlist" className={linkClass}>
                Wishlist
              </NavLink>
              <button
                onClick={handleLogout}
                className="font-medium text-stone-700 hover:text-amber-800"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
