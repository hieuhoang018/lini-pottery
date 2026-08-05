import { Search } from "lucide-react"

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
      />

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-stone-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-100"
      />
    </div>
  )
}
