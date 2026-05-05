import { Link } from "react-router-dom"

export function Emptylist({ subtitle }: { subtitle: string }) {
  return (
    <div className="mx-auto max-w-6xl">
      <p className="mt-4 text-stone-600">{subtitle}</p>

      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-amber-800 px-6 py-3 font-semibold text-white"
      >
        Tiếp tục mua hàng
      </Link>
    </div>
  )
}
