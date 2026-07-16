export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 h-4 w-32 animate-pulse rounded bg-stone-200" />

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
      <div className="h-130 w-full animate-pulse rounded-3xl bg-stone-200" />

      <div className="mt-4 grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-20 w-full animate-pulse rounded-xl bg-stone-200"
          />
        ))}
      </div>
    </div>
  )
}

function ProductInfoSkeleton() {
  return (
    <>
      <div className="h-4 w-28 animate-pulse rounded bg-stone-200" />

      <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-stone-300" />

      <div className="mt-5 h-8 w-32 animate-pulse rounded bg-stone-300" />

      <div className="mt-4 h-5 w-28 animate-pulse rounded bg-stone-200" />

      <div className="mt-7 space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-stone-200" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-stone-200" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-stone-200" />
      </div>

      <div className="mt-8 space-y-4 rounded-2xl bg-white p-5 ring-1 ring-stone-200">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex gap-3">
            <div className="h-5 w-24 animate-pulse rounded bg-stone-300" />
            <div className="h-5 w-40 animate-pulse rounded bg-stone-200" />
          </div>
        ))}
      </div>
    </>
  )
}

function ActionPanelSkeleton() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <div className="h-12 w-48 animate-pulse rounded-full bg-stone-300" />
      <div className="h-12 w-60 animate-pulse rounded-full bg-stone-200" />
    </div>
  )
}
