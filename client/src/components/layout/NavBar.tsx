import { Link, NavLink } from "react-router-dom"

export function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "font-semibold text-amber-800"
      : "font-medium text-stone-700 hover:text-amber-800"

  return (
    <header className="border-b border-stone-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold text-stone-900">
          <img src="/logo.png" alt="Logo" className="h-15" />
        </Link>

        <div className="flex items-center gap-6">
          <NavLink to="/" className={linkClass}>
            Shop
          </NavLink>

          <NavLink to="/cart" className={linkClass}>
            Cart
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
