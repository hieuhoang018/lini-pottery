import { Skeleton } from "../Skeleton"

export function ShopSkeletonLoading() {
  return (
    <section className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
        >
          <Skeleton className="h-64 bg-stone-200" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-3/4 rounded bg-stone-200" />
            <Skeleton className="h-4 w-1/2 rounded bg-stone-200" />
            <Skeleton className="h-10 w-full rounded bg-stone-200" />
          </div>
        </div>
      ))}
    </section>
  )
}
