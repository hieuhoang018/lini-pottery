import { Skeleton } from "../Skeleton"

export function CartSkeletonLoading() {
  return (
    <>
      <Skeleton className="mb-4 h-9 w-28 rounded-full bg-stone-200" />

      <section className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <CartItemSkeleton key={index} />
        ))}
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24 rounded bg-stone-200" />
          <Skeleton className="h-6 w-28 rounded bg-stone-300" />
        </div>

        <Skeleton className="mt-6 h-12 w-full rounded-full bg-stone-300" />
      </section>
    </>
  )
}

function CartItemSkeleton() {
  return (
    <article className="flex gap-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
      <Skeleton className="h-28 w-28 shrink-0 rounded-xl bg-stone-200" />

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Skeleton className="h-5 w-2/3 rounded bg-stone-200" />
          <Skeleton className="mt-3 h-4 w-24 rounded bg-stone-200" />
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full bg-stone-200" />
            <Skeleton className="h-5 w-8 rounded bg-stone-200" />
            <Skeleton className="h-8 w-8 rounded-full bg-stone-200" />
          </div>

          <Skeleton className="h-4 w-16 rounded bg-stone-200" />
        </div>
      </div>
    </article>
  )
}
