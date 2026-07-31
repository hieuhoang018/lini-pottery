import { Skeleton } from "../Skeleton"

export function OrderDetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl">
      <Skeleton className="mb-6 h-5 w-44 rounded bg-stone-200" />

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
          <Skeleton className="h-4 w-24 rounded bg-stone-200" />
          <Skeleton className="mt-3 h-8 w-3/4 rounded bg-stone-300" />
          <Skeleton className="mt-3 h-4 w-56 rounded bg-stone-200" />
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          <Skeleton className="h-6 w-32 rounded-full bg-stone-200" />
          <Skeleton className="h-6 w-36 rounded-full bg-stone-200" />
        </div>
      </div>
    </section>
  )
}

function OrderInformationSkeleton() {
  return (
    <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <Skeleton className="h-6 w-28 rounded bg-stone-300" />

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
      <Skeleton className="h-20 w-20 shrink-0 rounded-xl bg-stone-200" />

      <div className="flex-1">
        <Skeleton className="h-5 w-2/3 rounded bg-stone-200" />
        <Skeleton className="mt-2 h-4 w-28 rounded bg-stone-200" />
      </div>

      <Skeleton className="h-5 w-20 rounded bg-stone-200" />
    </div>
  )
}

function OrderAddressSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <Skeleton className="h-6 w-40 rounded bg-stone-300" />

      <div className="mt-4 space-y-2">
        <Skeleton className="h-5 w-40 rounded bg-stone-200" />
        <Skeleton className="h-4 w-32 rounded bg-stone-200" />
        <Skeleton className="h-4 w-64 rounded bg-stone-200" />
        <Skeleton className="h-4 w-44 rounded bg-stone-200" />
        <Skeleton className="h-4 w-28 rounded bg-stone-200" />
        <div className="pt-2">
          <Skeleton className="h-4 w-56 rounded bg-stone-200" />
        </div>
      </div>
    </div>
  )
}

function OrderSummarySkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <Skeleton className="h-6 w-24 rounded bg-stone-300" />

      <div className="mt-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24 rounded bg-stone-200" />
          <Skeleton className="h-4 w-20 rounded bg-stone-200" />
        </div>

        <div className="flex justify-between">
          <Skeleton className="h-4 w-28 rounded bg-stone-200" />
          <Skeleton className="h-4 w-20 rounded bg-stone-200" />
        </div>

        <div className="flex justify-between border-t border-stone-200 pt-3">
          <Skeleton className="h-5 w-24 rounded bg-stone-300" />
          <Skeleton className="h-5 w-24 rounded bg-stone-300" />
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-stone-50 p-4">
        <Skeleton className="h-5 w-36 rounded bg-stone-200" />
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full rounded bg-stone-200" />
          <Skeleton className="h-4 w-5/6 rounded bg-stone-200" />
        </div>
      </div>
    </div>
  )
}

function OrderPaymentRecordsSkeleton() {
  return (
    <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <Skeleton className="h-6 w-56 rounded bg-stone-300" />

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
        <Skeleton className="h-5 w-28 rounded bg-stone-200" />
        <Skeleton className="h-6 w-24 rounded-full bg-stone-200" />
      </div>

      <Skeleton className="mt-3 h-4 w-3/4 rounded bg-stone-200" />
      <Skeleton className="mt-3 h-4 w-52 rounded bg-stone-200" />
    </div>
  )
}
