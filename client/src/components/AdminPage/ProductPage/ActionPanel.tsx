import type { Category } from "../../../types/category"
import type {
  ActiveFilter,
  SortOption,
  StockFilter,
} from "../../../types/params"
import { SearchInput } from "../../SearchInput"

type ActionPanelProps = {
  searchTerm: string
  selectedCategory: string
  sortOption: SortOption
  activeFilter: ActiveFilter
  stockFilter: StockFilter
  categories: Category[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSortChange: (value: SortOption) => void
  onActiveFilterChange: (value: ActiveFilter) => void
  onStockFilterChange: (value: StockFilter) => void
  onClearFilters: () => void
}

export function ActionPanel({
  searchTerm,
  selectedCategory,
  sortOption,
  activeFilter,
  stockFilter,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onActiveFilterChange,
  onStockFilterChange,
  onClearFilters,
}: ActionPanelProps) {
  return (
    <section className="mb-5 rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto_auto_auto_auto]">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Tìm sản phẩm..."
        />

        <select
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
        >
          <option value="">Tất cả phân loại</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={activeFilter}
          onChange={(event) =>
            onActiveFilterChange(event.target.value as ActiveFilter)
          }
          className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>

        <select
          value={stockFilter}
          onChange={(event) =>
            onStockFilterChange(event.target.value as StockFilter)
          }
          className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
        >
          <option value="all">Tất cả trạng thái tồn kho</option>
          <option value="available">Còn hàng</option>
          <option value="out_of_stock">Hết hàng</option>
        </select>

        <select
          value={sortOption}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Rẻ đến đắt</option>
          <option value="price_desc">Đắt đến rẻ</option>
        </select>

        <button
          onClick={onClearFilters}
          className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100"
        >
          Xóa bộ lọc
        </button>
      </div>
    </section>
  )
}
