import { Skeleton } from "../Skeleton"

export function AdminCreateProductSkeleton() {
  return (
    <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <Skeleton className="mb-6 h-4 w-44 rounded bg-stone-200" />

      <Skeleton className="h-8 w-48 rounded bg-stone-300" />
      <Skeleton className="mt-3 h-4 w-64 rounded bg-stone-200" />

      <div className="mt-6 space-y-4">
        <InputSkeleton />
        <InputSkeleton />

        <div>
          <Skeleton className="h-4 w-24 rounded bg-stone-200" />
          <Skeleton className="mt-2 h-12 w-full rounded-xl bg-stone-200" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InputSkeleton />
          <InputSkeleton />
        </div>

        <InputSkeleton />
        <InputSkeleton />

        <div className="grid gap-4 md:grid-cols-2">
          <InputSkeleton />
          <InputSkeleton />
        </div>

        <InputSkeleton />
        <InputSkeleton />
        <InputSkeleton />

        <Skeleton className="h-12 w-full rounded-full bg-stone-300" />
      </div>
    </section>
  )
}

function InputSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-28 rounded bg-stone-200" />
      <Skeleton className="mt-2 h-12 w-full rounded-xl bg-stone-200" />
    </div>
  )
}
