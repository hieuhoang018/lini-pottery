export function AdminProductsSkeletonLoading() {
  return (
    <>
      <div className="mb-4 h-5 w-36 animate-pulse rounded bg-stone-200" />

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <AdminProductCardSkeleton key={index} />
        ))}
      </div>
    </>
  )
}

function AdminProductCardSkeleton() {
  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
      <div className="grid gap-4 md:grid-cols-[100px_1fr_auto]">
        <div className="h-24 w-24 animate-pulse rounded-xl bg-stone-200" />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-5 w-40 animate-pulse rounded bg-stone-300" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-stone-200" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-stone-200" />
          </div>

          <div className="mt-3 h-4 w-48 animate-pulse rounded bg-stone-200" />

          <div className="mt-3 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-stone-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-stone-200" />
          </div>
        </div>

        <div className="flex flex-col gap-3 md:w-40">
          <div>
            <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
            <div className="mt-1 h-10 w-full animate-pulse rounded-xl bg-stone-200" />
          </div>

          <div className="h-10 w-full animate-pulse rounded-full bg-stone-200" />
          <div className="h-10 w-full animate-pulse rounded-full bg-stone-200" />
        </div>
      </div>
    </article>
  )
}
