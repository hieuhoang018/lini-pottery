import { Skeleton } from "../Skeleton"

export function AdminOrderDetailSkeleton() {
  return (
    <section className="grid gap-8 xl:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <OrderTitleCardSkeleton />
        <CustomerTitleCardSkeleton />
        <OrderDetailsSkeleton />
        <ShippingAddressSkeleton />
        <PaymentRecordsCardSkeleton />
      </div>

      <aside className="h-fit space-y-6">
        <ActionPanelSkeleton />
        <SummarySectionSkeleton />
      </aside>
    </section>
  )
}

function OrderTitleCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <Skeleton className="mb-6 h-4 w-44 rounded bg-stone-200" />

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Skeleton className="h-8 w-56 rounded bg-stone-300" />
          <Skeleton className="mt-3 h-4 w-72 rounded bg-stone-200" />
          <Skeleton className="mt-2 h-4 w-56 rounded bg-stone-200" />
        </div>

        <div className="md:text-right">
          <Skeleton className="h-4 w-20 rounded bg-stone-200 md:ml-auto" />
          <Skeleton className="mt-3 h-8 w-32 rounded bg-stone-300" />
        </div>
      </div>
    </div>
  )
}

function CustomerTitleCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <Skeleton className="h-7 w-32 rounded bg-stone-300" />

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="h-4 w-20 rounded bg-stone-200" />
            <Skeleton className="mt-2 h-5 w-36 rounded bg-stone-200" />
          </div>
        ))}
      </div>
    </div>
  )
}

function OrderDetailsSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <Skeleton className="h-7 w-28 rounded bg-stone-300" />

      <div className="mt-5 space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <OrderItemSkeleton key={index} />
        ))}
      </div>
    </div>
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

function ShippingAddressSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <Skeleton className="h-7 w-44 rounded bg-stone-300" />

      <div className="mt-4 space-y-2">
        <Skeleton className="h-5 w-40 rounded bg-stone-200" />
        <Skeleton className="h-4 w-32 rounded bg-stone-200" />
        <Skeleton className="h-4 w-64 rounded bg-stone-200" />
        <Skeleton className="h-4 w-44 rounded bg-stone-200" />
        <Skeleton className="h-4 w-28 rounded bg-stone-200" />
      </div>

      <Skeleton className="mt-3 h-16 w-full rounded-xl bg-stone-100" />
    </div>
  )
}

function PaymentRecordsCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <Skeleton className="h-7 w-44 rounded bg-stone-300" />

      <div className="mt-4 space-y-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <PaymentRecordSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

function PaymentRecordSkeleton() {
  return (
    <div className="rounded-xl bg-stone-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-5 w-28 rounded bg-stone-200" />
        <Skeleton className="h-6 w-24 rounded-full bg-stone-200" />
      </div>

      <Skeleton className="mt-3 h-4 w-3/4 rounded bg-stone-200" />
      <Skeleton className="mt-3 h-4 w-48 rounded bg-stone-200" />
      <Skeleton className="mt-2 h-4 w-52 rounded bg-stone-200" />
    </div>
  )
}

function ActionPanelSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <Skeleton className="h-7 w-40 rounded bg-stone-300" />

      <div className="mt-5">
        <Skeleton className="h-4 w-36 rounded bg-stone-200" />
        <Skeleton className="mt-2 h-12 w-full rounded-xl bg-stone-200" />
      </div>

      <div className="mt-4">
        <Skeleton className="h-4 w-40 rounded bg-stone-200" />
        <Skeleton className="mt-2 h-12 w-full rounded-xl bg-stone-200" />
      </div>

      <Skeleton className="mt-6 h-12 w-full rounded-full bg-stone-200" />
    </div>
  )
}

function SummarySectionSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <Skeleton className="h-7 w-28 rounded bg-stone-300" />

      <div className="mt-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24 rounded bg-stone-200" />
          <Skeleton className="h-4 w-20 rounded bg-stone-200" />
        </div>

        <div className="flex justify-between">
          <Skeleton className="h-4 w-28 rounded bg-stone-200" />
          <Skeleton className="h-4 w-20 rounded bg-stone-200" />
        </div>

        <div className="border-t border-stone-200 pt-3">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-24 rounded bg-stone-300" />
            <Skeleton className="h-6 w-28 rounded bg-stone-300" />
          </div>
        </div>
      </div>
    </div>
  )
}
