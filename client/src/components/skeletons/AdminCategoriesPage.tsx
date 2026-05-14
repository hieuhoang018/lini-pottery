export function AdminCategoriesSkeleton() {
  return (
    <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="h-8 w-56 animate-pulse rounded bg-stone-300" />

      <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-4">
        <div className="h-4 w-36 animate-pulse rounded bg-stone-200" />

        <div className="mt-3 flex gap-2">
          <div className="h-12 flex-1 animate-pulse rounded-xl bg-stone-200" />
          <div className="h-12 w-20 animate-pulse rounded-xl bg-stone-300" />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-stone-200 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="h-5 w-36 animate-pulse rounded bg-stone-300" />
                <div className="mt-2 h-4 w-24 animate-pulse rounded bg-stone-200" />
              </div>

              <div className="flex gap-2">
                <div className="h-10 w-16 animate-pulse rounded-xl bg-stone-200" />
                <div className="h-10 w-16 animate-pulse rounded-xl bg-stone-300" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
