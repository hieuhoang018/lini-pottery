import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { checkoutGuest, checkoutLoggedInUser } from "../api/orderApi"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"

export function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, total, clearCart } = useCart()

  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    recipientName: "",
    phone: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    country: "Finland",
    additionalInfo: "",
    notes: "",
  })

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    if (
      !form.recipientName ||
      !form.phone ||
      !form.streetAddress ||
      !form.city ||
      !form.postalCode ||
      !form.country
    ) {
      toast.error("Please fill in all required shipping fields")
      return
    }

    if (!user && (!form.guestName || !form.guestPhone)) {
      toast.error("Please fill in your guest contact information")
      return
    }

    try {
      setSubmitting(true)

      if (user) {
        await checkoutLoggedInUser({
          recipientName: form.recipientName,
          phone: form.phone,
          streetAddress: form.streetAddress,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
          additionalInfo: form.additionalInfo || undefined,
          notes: form.notes || undefined,
        })
      } else {
        await checkoutGuest({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          guestName: form.guestName,
          guestEmail: form.guestEmail || undefined,
          guestPhone: form.guestPhone,
          recipientName: form.recipientName,
          phone: form.phone,
          streetAddress: form.streetAddress,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
          additionalInfo: form.additionalInfo || undefined,
          notes: form.notes || undefined,
        })
      }

      await clearCart()
      toast.success("Order placed successfully")
      if (user) {
        navigate("/orders")
      } else {
        navigate("/")
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Checkout failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-stone-900">Checkout</h1>
          <p className="mt-4 text-stone-600">Your cart is empty.</p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-amber-800 px-6 py-3 font-semibold text-white"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-stone-900">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_380px]">
        <section>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="mt-2 text-stone-600">
            Complete your shipping details. Payment is done by bank QR transfer.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200"
          >
            {!user && (
              <section>
                <h2 className="text-xl font-semibold">Guest information</h2>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="block text-sm font-medium text-stone-700">
                    Name *
                    <input
                      name="guestName"
                      value={form.guestName}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
                    />
                  </label>

                  <label className="block text-sm font-medium text-stone-700">
                    Phone *
                    <input
                      name="guestPhone"
                      value={form.guestPhone}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
                    />
                  </label>

                  <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                    Email optional
                    <input
                      name="guestEmail"
                      type="email"
                      value={form.guestEmail}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
                    />
                  </label>
                </div>
              </section>
            )}

            <section>
              <h2 className="text-xl font-semibold">Shipping address</h2>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-medium text-stone-700">
                  Recipient name *
                  <input
                    name="recipientName"
                    value={form.recipientName}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
                  />
                </label>

                <label className="block text-sm font-medium text-stone-700">
                  Phone *
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
                  />
                </label>

                <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                  Street address *
                  <input
                    name="streetAddress"
                    value={form.streetAddress}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
                  />
                </label>

                <label className="block text-sm font-medium text-stone-700">
                  City *
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
                  />
                </label>

                <label className="block text-sm font-medium text-stone-700">
                  Postal code *
                  <input
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
                  />
                </label>

                <label className="block text-sm font-medium text-stone-700">
                  Country *
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
                  />
                </label>

                <label className="block text-sm font-medium text-stone-700">
                  Additional info
                  <input
                    name="additionalInfo"
                    value={form.additionalInfo}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
                  />
                </label>

                <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                  Notes
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl bg-amber-50 p-5 text-sm text-amber-900">
              <h2 className="font-semibold">Payment instruction</h2>
              <p className="mt-2">
                After placing the order, please scan the bank QR code or
                transfer to the provided bank account. Admin will confirm your
                payment manually.
              </p>
            </section>

            <button
              disabled={submitting}
              className="w-full rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              {submitting ? "Placing order..." : "Place order"}
            </button>
          </form>
        </section>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-xl font-semibold">Order summary</h2>

          <div className="mt-5 space-y-4">
            {items.map((item) => {
              const image =
                item.product.featuredImageUrl ||
                item.product.images[0]?.imageUrl ||
                "/placeholder.png"

              return (
                <div key={item.product.id} className="flex gap-3">
                  <img
                    src={image}
                    alt={item.product.name}
                    className="h-16 w-16 rounded-xl bg-stone-200 object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-stone-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-medium">
                    €{(Number(item.product.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="mt-6 border-t border-stone-200 pt-5">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>€{total.toFixed(2)}</span>
            </div>

            <div className="mt-2 flex justify-between text-stone-600">
              <span>Shipping</span>
              <span>€0.00</span>
            </div>

            <div className="mt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
