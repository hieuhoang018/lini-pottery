import { Skeleton } from "../Skeleton"

export function AdminProductDetailSkeleton() {
  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <Skeleton className="mb-6 h-4 w-44 rounded bg-stone-200" />

        <Skeleton className="h-8 w-56 rounded bg-stone-300" />
        <Skeleton className="mt-3 h-4 w-72 rounded bg-stone-200" />

        <ProductEditFormSkeleton />
      </section>

      <aside className="space-y-6">
        <ProductPreviewSkeleton />
        <ProductImagesManagerSkeleton />
      </aside>
    </div>
  )
}

function ProductEditFormSkeleton() {
  return (
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

      <div className="grid gap-4 md:grid-cols-2">
        <InputSkeleton />
        <InputSkeleton />
      </div>

      <InputSkeleton />
      <InputSkeleton />
      <InputSkeleton />

      <Skeleton className="h-12 w-full rounded-full bg-stone-300" />
    </div>
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

function ProductPreviewSkeleton() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <Skeleton className="h-7 w-28 rounded bg-stone-300" />

      <Skeleton className="mt-4 h-64 w-full rounded-2xl bg-stone-200" />

      <Skeleton className="mt-4 h-5 w-40 rounded bg-stone-200" />
      <Skeleton className="mt-2 h-4 w-24 rounded bg-stone-200" />
      <Skeleton className="mt-3 h-4 w-48 rounded bg-stone-200" />
    </section>
  )
}

function ProductImagesManagerSkeleton() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="mt-4 rounded-2xl bg-stone-50 p-4">
        <Skeleton className="h-5 w-40 rounded bg-stone-300" />

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <ImageCardSkeleton key={index} />
          ))}
        </div>

        <div className="mt-5 grid gap-3">
          <InputSkeleton />
          <InputSkeleton />
          <InputSkeleton />

          <Skeleton className="h-10 w-full rounded-full bg-stone-300" />
        </div>
      </div>
    </section>
  )
}

function ImageCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-stone-200">
      <Skeleton className="h-28 w-full bg-stone-200" />

      <div className="p-3">
        <Skeleton className="h-3 w-16 rounded bg-stone-200" />
        <Skeleton className="mt-2 h-3 w-24 rounded bg-stone-200" />
        <Skeleton className="mt-3 h-3 w-10 rounded bg-stone-200" />
      </div>
    </div>
  )
}

export function ProductImagesSkeleton() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl bg-white ring-1 ring-stone-200"
        >
          <Skeleton className="h-28 w-full bg-stone-200" />

          <div className="p-3">
            <Skeleton className="h-3 w-16 rounded bg-stone-200" />
            <Skeleton className="mt-2 h-3 w-24 rounded bg-stone-200" />
            <Skeleton className="mt-3 h-3 w-10 rounded bg-stone-200" />
          </div>
        </div>
      ))}
    </div>
  )
}
