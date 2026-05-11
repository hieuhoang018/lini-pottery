import { MainShopSection } from "../components/ShopPage/MainShopSection"

export function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-10">
        <p className="text-sm font-bold uppercase tracking-widest text-amber-800">
          Handmade pottery
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          Shop unique ceramic pieces
        </h1>

        <p className="mt-4 max-w-2xl text-stone-600">
          Browse handmade mugs, bowls, vases, tea sets, and decorative pottery.
        </p>
      </section>

      <MainShopSection />
    </div>
  )
}
