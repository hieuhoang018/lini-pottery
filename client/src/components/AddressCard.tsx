import type { AddressCardAddress } from "../types/order"

type AddressCardProps = {
  address: AddressCardAddress | null | undefined
  title: string
  headingLevel?: "h2" | "h3"
  emptyMessage?: string
  variant?: "card" | "plain"
}

export function AddressCard({
  address,
  title,
  headingLevel = "h2",
  emptyMessage,
  variant = "card",
}: AddressCardProps) {
  const Heading = headingLevel

  if (variant === "plain") {
    return (
      <section className="mt-6 rounded-2xl bg-stone-50 p-5 text-sm text-stone-700">
        <Heading className="text-lg font-semibold text-stone-900">{title}</Heading>

        {address ? (
          <div className="mt-3 space-y-1">
            <p className="font-medium">{address.recipientName}</p>
            <p>{address.phone}</p>
            <p>{address.streetAddress}</p>
            <p>
              {address.postalCode} {address.city}
            </p>
            <p>{address.country}</p>
          </div>
        ) : (
          emptyMessage && <p className="mt-3">{emptyMessage}</p>
        )}
      </section>
    )
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <Heading className={headingLevel === "h2" ? "text-lg font-semibold" : "text-xl font-semibold"}>
        {title}
      </Heading>

      {address ? (
        <div className="mt-4 space-y-1 text-sm text-stone-700">
          <p className="font-medium">{address.recipientName}</p>
          <p>{address.phone}</p>
          <p>{address.streetAddress}</p>
          <p>
            {address.postalCode} {address.city}
          </p>
          <p>{address.country}</p>

          {address.additionalInfo && (
            <p className="mt-3 rounded-xl bg-stone-50 p-3 text-stone-600">
              {address.additionalInfo}
            </p>
          )}
        </div>
      ) : (
        emptyMessage && <p className="mt-4 text-sm text-stone-600">{emptyMessage}</p>
      )}
    </div>
  )
}
