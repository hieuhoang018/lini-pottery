import { useState } from "react"
import { getMyOrders } from "../../api/orderApi"
import { useApiFetch } from "../../hooks/useApiFetch"
import type { Order } from "../../types/order"
import { Link } from "react-router-dom"
import { RefreshCw, Search } from "lucide-react"
import { OrdersList } from "./OrdersList"
import { useDebounce } from "../../hooks/useDebounce"

export function MainOrdersSection() {
  const [searchTerm, setSearchTerm] = useState("")

  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 400)

  const {
    data: orders,
    loading,
    refetch,
  } = useApiFetch<Order[]>(
    () => getMyOrders({ search: debouncedSearchTerm }),
    [debouncedSearchTerm],
  )

  return (
    <div className="mt-6">
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <section className="flex-1 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              />

              <input
                type="text"
                placeholder="Tìm đơn hàng của bạn..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-xl border border-stone-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("")
                }}
                className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 sm:self-stretch"
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>
        </section>

        <button
          onClick={refetch}
          className="rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-stone-100"
        >
          <RefreshCw />
        </button>
      </div>

      {loading && <div className="mt-8 text-stone-600">Loading orders...</div>}

      {!orders || orders.length === 0 ? (
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <p className="text-stone-600">
            {debouncedSearchTerm
              ? "Không tìm thấy đơn hàng phù hợp."
              : "Bạn chưa có đơn hàng nào."}
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900"
          >
            Tiếp tục mua sắm
          </Link>
        </section>
      ) : (
        <OrdersList orders={orders} />
      )}
    </div>
  )
}
