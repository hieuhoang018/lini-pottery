import { useState } from "react"
import { Link } from "react-router-dom"
import { NavLinks } from "./NavLinks"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-2">
          <Link to="/" className="inline-flex items-center">
            <img src="/logo.png" alt="Lini Pottery" className="h-16 w-auto" />
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <NavLinks setMobileMenuOpen={setMobileMenuOpen} />
          </div>

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
            <NavLinks setMobileMenuOpen={setMobileMenuOpen} />
          </div>
        )}
      </nav>
    </header>
  )
}
