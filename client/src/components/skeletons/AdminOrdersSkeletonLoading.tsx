import { Skeleton } from "../Skeleton"

export function AdminOrdersSkeletonLoading() {
  return (
    <>
      <Skeleton className="mb-4 h-5 w-32 rounded bg-stone-200" />

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
          <Skeleton className="h-4 w-24 rounded bg-stone-200" />
          <Skeleton className="mt-3 h-5 w-40 rounded bg-stone-300" />
          <Skeleton className="mt-3 h-3 w-64 rounded bg-stone-200" />
          <Skeleton className="mt-2 h-3 w-36 rounded bg-stone-200" />
        </div>

        <div>
          <Skeleton className="h-4 w-32 rounded bg-stone-200" />
          <Skeleton className="mt-2 h-10 w-full rounded-xl bg-stone-200" />
        </div>

        <div>
          <Skeleton className="h-4 w-36 rounded bg-stone-200" />
          <Skeleton className="mt-2 h-10 w-full rounded-xl bg-stone-200" />
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <Skeleton className="h-7 w-24 rounded bg-stone-300" />
          <Skeleton className="h-10 w-24 rounded-full bg-stone-200" />
        </div>
      </div>
    </article>
  )
}
