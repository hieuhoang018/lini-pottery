import { useCart } from "../contexts/CartContext"
import { Emptylist } from "../components/layout/EmptyList"
import { OrderSummary } from "../components/CheckoutPage/OrderSummary"
import { InformationForm } from "../components/CheckoutPage/InformationForm"

export function CheckoutPage() {
  const { items } = useCart()

  if (items.length === 0) {
    return <Emptylist subtitle="Giỏ hàng của bạn trống." />
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_380px]">
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Thanh toán</h1>
            <p className="mt-2 text-stone-600">Điền thông tin giao hàng.</p>
          </div>
        </div>

        <InformationForm />
      </section>

      <OrderSummary />
    </div>
  )
}
