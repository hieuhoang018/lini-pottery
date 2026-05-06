export function SkeletonLoading() {
  return (
    <section className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
        >
          <div className="h-64 animate-pulse bg-stone-200" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200" />
            <div className="h-10 w-full animate-pulse rounded bg-stone-200" />
          </div>
        </div>
      ))}
    </section>
  )
}
