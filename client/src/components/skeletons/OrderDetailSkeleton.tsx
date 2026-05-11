export function OrderDetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 h-5 w-44 animate-pulse rounded bg-stone-200" />

      <OrderTitleCardSkeleton />

      <OrderInformationSkeleton />

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <OrderAddressSkeleton />
        <OrderSummarySkeleton />
      </section>

      <OrderPaymentRecordsSkeleton />
    </div>
  )
}

function OrderTitleCardSkeleton() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
          <div className="mt-3 h-8 w-3/4 animate-pulse rounded bg-stone-300" />
          <div className="mt-3 h-4 w-56 animate-pulse rounded bg-stone-200" />
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          <div className="h-6 w-32 animate-pulse rounded-full bg-stone-200" />
          <div className="h-6 w-36 animate-pulse rounded-full bg-stone-200" />
        </div>
      </div>
    </section>
  )
}

function OrderInformationSkeleton() {
  return (
    <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="h-6 w-28 animate-pulse rounded bg-stone-300" />

      <div className="mt-5 space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <OrderItemSkeleton key={index} />
        ))}
      </div>
    </section>
  )
}

function OrderItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-stone-50 p-4">
      <div className="h-20 w-20 shrink-0 animate-pulse rounded-xl bg-stone-200" />

      <div className="flex-1">
        <div className="h-5 w-2/3 animate-pulse rounded bg-stone-200" />
        <div className="mt-2 h-4 w-28 animate-pulse rounded bg-stone-200" />
      </div>

      <div className="h-5 w-20 animate-pulse rounded bg-stone-200" />
    </div>
  )
}

function OrderAddressSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="h-6 w-40 animate-pulse rounded bg-stone-300" />

      <div className="mt-4 space-y-2">
        <div className="h-5 w-40 animate-pulse rounded bg-stone-200" />
        <div className="h-4 w-32 animate-pulse rounded bg-stone-200" />
        <div className="h-4 w-64 animate-pulse rounded bg-stone-200" />
        <div className="h-4 w-44 animate-pulse rounded bg-stone-200" />
        <div className="h-4 w-28 animate-pulse rounded bg-stone-200" />
        <div className="pt-2">
          <div className="h-4 w-56 animate-pulse rounded bg-stone-200" />
        </div>
      </div>
    </div>
  )
}

function OrderSummarySkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="h-6 w-24 animate-pulse rounded bg-stone-300" />

      <div className="mt-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-stone-200" />
        </div>

        <div className="flex justify-between">
          <div className="h-4 w-28 animate-pulse rounded bg-stone-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-stone-200" />
        </div>

        <div className="flex justify-between border-t border-stone-200 pt-3">
          <div className="h-5 w-24 animate-pulse rounded bg-stone-300" />
          <div className="h-5 w-24 animate-pulse rounded bg-stone-300" />
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-stone-50 p-4">
        <div className="h-5 w-36 animate-pulse rounded bg-stone-200" />
        <div className="mt-3 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-stone-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-stone-200" />
        </div>
      </div>
    </div>
  )
}

function OrderPaymentRecordsSkeleton() {
  return (
    <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="h-6 w-56 animate-pulse rounded bg-stone-300" />

      <div className="mt-4 space-y-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <PaymentRecordSkeleton key={index} />
        ))}
      </div>
    </section>
  )
}

function PaymentRecordSkeleton() {
  return (
    <div className="rounded-xl bg-stone-50 p-4">
      <div className="flex flex-wrap justify-between gap-2">
        <div className="h-5 w-28 animate-pulse rounded bg-stone-200" />
        <div className="h-6 w-24 animate-pulse rounded-full bg-stone-200" />
      </div>

      <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-stone-200" />
      <div className="mt-3 h-4 w-52 animate-pulse rounded bg-stone-200" />
    </div>
  )
}
