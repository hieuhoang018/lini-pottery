import { Skeleton } from "../Skeleton"

export function OrdersSkeletonLoading() {
  return (
    <section className="mt-3 space-y-5">
      {Array.from({ length: 3 }).map((_, index) => (
        <OrderCardSkeleton key={index} />
      ))}
    </section>
  )
}

function OrderCardSkeleton() {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Skeleton className="h-4 w-24 rounded bg-stone-200" />
          <Skeleton className="mt-2 h-5 w-64 rounded bg-stone-200" />
          <Skeleton className="mt-3 h-4 w-36 rounded bg-stone-200" />
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          <Skeleton className="h-6 w-28 rounded-full bg-stone-200" />
          <Skeleton className="h-6 w-32 rounded-full bg-stone-200" />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <OrderItemSkeleton key={index} />
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-20 rounded bg-stone-200" />
          <Skeleton className="h-7 w-28 rounded bg-stone-300" />
        </div>

        <Skeleton className="h-10 w-28 rounded-full bg-stone-200" />
      </div>
    </article>
  )
}

function OrderItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-stone-50 p-4">
      <Skeleton className="h-16 w-16 shrink-0 rounded-xl bg-stone-200" />

      <div className="flex-1">
        <Skeleton className="h-5 w-2/3 rounded bg-stone-200" />
        <Skeleton className="mt-2 h-4 w-28 rounded bg-stone-200" />
      </div>

      <Skeleton className="h-5 w-20 rounded bg-stone-200" />
    </div>
  )
}
