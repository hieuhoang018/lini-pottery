export function CartSkeletonLoading() {
  return (
    <>
      <div className="mb-4 h-9 w-28 animate-pulse rounded-full bg-stone-200" />

      <section className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <CartItemSkeleton key={index} />
        ))}
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 animate-pulse rounded bg-stone-200" />
          <div className="h-6 w-28 animate-pulse rounded bg-stone-300" />
        </div>

        <div className="mt-6 h-12 w-full animate-pulse rounded-full bg-stone-300" />
      </section>
    </>
  )
}

function CartItemSkeleton() {
  return (
    <article className="flex gap-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
      <div className="h-28 w-28 shrink-0 animate-pulse rounded-xl bg-stone-200" />

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="h-5 w-2/3 animate-pulse rounded bg-stone-200" />
          <div className="mt-3 h-4 w-24 animate-pulse rounded bg-stone-200" />
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 animate-pulse rounded-full bg-stone-200" />
            <div className="h-5 w-8 animate-pulse rounded bg-stone-200" />
            <div className="h-8 w-8 animate-pulse rounded-full bg-stone-200" />
          </div>

          <div className="h-4 w-16 animate-pulse rounded bg-stone-200" />
        </div>
      </div>
    </article>
  )
}
