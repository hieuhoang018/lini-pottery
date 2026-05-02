import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Lini Trầm Gốm
            </h2>
            <p className="mt-3 max-w-sm text-sm text-gray-600">
              Handmade pottery and ceramic products made with care for everyday
              use and home decoration.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
              Cửa hàng
            </h3>
            <div className="mt-3 flex flex-col gap-2 text-sm text-gray-600">
              <Link to="/products" className="hover:text-gray-900">
                Sản phẩm
              </Link>
              <Link to="/cart" className="hover:text-gray-900">
                Giỏ hàng
              </Link>
              <Link to="/wishlist" className="hover:text-gray-900">
                Danh sách yêu thích
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
              Liên lạc
            </h3>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <p>Email: support@linipottery.com</p>
              <p>Địa chỉ: Tampere, Finland</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Lini Trầm Gốm. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
