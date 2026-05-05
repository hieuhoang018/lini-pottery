import { Search } from "lucide-react"
import type { Category } from "../../types/category"

type SortOption = "newest" | "price_asc" | "price_desc"

type ShopActionPanelProps = {
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>

  selectedCategory: string
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>

  sortOption: SortOption
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>

  availableOnly: boolean
  setAvailableOnly: React.Dispatch<React.SetStateAction<boolean>>

  categories: Category[]

  clearFilters: () => void
}

export function ShopActionPanel({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortOption,
  setSortOption,
  availableOnly,
  setAvailableOnly,
  categories,
  clearFilters,
}: ShopActionPanelProps) {
  return (
    <section className="mb-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
          />

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border border-stone-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
          />
        </div>

        <select
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value as SortOption)}
          className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>

        <label className="flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(event) => setAvailableOnly(event.target.checked)}
            className="h-4 w-4 accent-amber-800"
          />
          Available only
        </label>

        <button
          type="button"
          onClick={clearFilters}
          className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100"
        >
          Clear
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className={`rounded-full border px-5 py-2 text-sm font-medium ${
            selectedCategory === ""
              ? "border-amber-800 bg-amber-800 text-white"
              : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
          }`}
          onClick={() => setSelectedCategory("")}
        >
          Tất cả
        </button>

        {categories.map((category) => (
          <button
            type="button"
            key={category.id}
            className={`rounded-full border px-5 py-2 text-sm font-medium ${
              selectedCategory === category.slug
                ? "border-amber-800 bg-amber-800 text-white"
                : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
            }`}
            onClick={() => setSelectedCategory(category.slug)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  )
}
