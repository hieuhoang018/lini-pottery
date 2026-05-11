export function AdminOrdersSkeletonLoading() {
  return (
    <>
      <div className="mb-4 h-5 w-32 animate-pulse rounded bg-stone-200" />

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <AdminOrderCardSkeleton key={index} />
        ))}
      </div>
    </>
  )
}

function AdminOrderCardSkeleton() {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr_1fr_auto] lg:items-center">
        <div>
          <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
          <div className="mt-3 h-5 w-40 animate-pulse rounded bg-stone-300" />
          <div className="mt-3 h-3 w-64 animate-pulse rounded bg-stone-200" />
          <div className="mt-2 h-3 w-36 animate-pulse rounded bg-stone-200" />
        </div>

        <div>
          <div className="h-4 w-32 animate-pulse rounded bg-stone-200" />
          <div className="mt-2 h-10 w-full animate-pulse rounded-xl bg-stone-200" />
        </div>

        <div>
          <div className="h-4 w-36 animate-pulse rounded bg-stone-200" />
          <div className="mt-2 h-10 w-full animate-pulse rounded-xl bg-stone-200" />
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="h-7 w-24 animate-pulse rounded bg-stone-300" />
          <div className="h-10 w-24 animate-pulse rounded-full bg-stone-200" />
        </div>
      </div>
    </article>
  )
}
