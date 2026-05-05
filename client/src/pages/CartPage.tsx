import { MainCartSection } from "../components/CartPage/MainCartSection"

export function CartPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl mb-8 font-bold">Giỏ hàng của bạn</h1>
      <MainCartSection />
    </div>
  )
}
