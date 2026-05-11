export function WishlistSkeletonLoading() {
  return (
    <>
      <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="h-12 w-full animate-pulse rounded-xl bg-stone-200" />
      </div>

      <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <WishlistItemSkeleton key={index} />
        ))}
      </section>
    </>
  )
}

function WishlistItemSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
      <div className="h-64 w-full animate-pulse bg-stone-200" />

      <div className="p-5">
        <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />

        <div className="mt-3 h-6 w-3/4 animate-pulse rounded bg-stone-200" />

        <div className="mt-3 h-4 w-20 animate-pulse rounded bg-stone-200" />

        <div className="mt-5 flex gap-3">
          <div className="h-10 flex-1 animate-pulse rounded-full bg-stone-300" />
          <div className="h-10 w-20 animate-pulse rounded-full bg-stone-200" />
        </div>
      </div>
    </article>
  )
}
