import { Skeleton } from "../Skeleton"

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl">
      <Skeleton className="mb-8 h-4 w-32 rounded bg-stone-200" />

      <section className="grid gap-10 lg:grid-cols-2">
        <ImageGallerySkeleton />

        <div>
          <ProductInfoSkeleton />
          <ActionPanelSkeleton />
        </div>
      </section>
    </div>
  )
}

function ImageGallerySkeleton() {
  return (
    <div>
      <Skeleton className="h-130 w-full rounded-3xl bg-stone-200" />

      <div className="mt-4 grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-xl bg-stone-200" />
        ))}
      </div>
    </div>
  )
}

function ProductInfoSkeleton() {
  return (
    <>
      <Skeleton className="h-4 w-28 rounded bg-stone-200" />

      <Skeleton className="mt-4 h-10 w-3/4 rounded bg-stone-300" />

      <Skeleton className="mt-5 h-8 w-32 rounded bg-stone-300" />

      <Skeleton className="mt-4 h-5 w-28 rounded bg-stone-200" />

      <div className="mt-7 space-y-3">
        <Skeleton className="h-4 w-full rounded bg-stone-200" />
        <Skeleton className="h-4 w-11/12 rounded bg-stone-200" />
        <Skeleton className="h-4 w-4/5 rounded bg-stone-200" />
      </div>

      <div className="mt-8 space-y-4 rounded-2xl bg-white p-5 ring-1 ring-stone-200">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex gap-3">
            <Skeleton className="h-5 w-24 rounded bg-stone-300" />
            <Skeleton className="h-5 w-40 rounded bg-stone-200" />
          </div>
        ))}
      </div>
    </>
  )
}

function ActionPanelSkeleton() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Skeleton className="h-12 w-48 rounded-full bg-stone-300" />
      <Skeleton className="h-12 w-60 rounded-full bg-stone-200" />
    </div>
  )
}
