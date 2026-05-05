import type { Product } from "../../types/product"
import { ProductCard } from "./ProductCard"

export function ProductList({ products }: { products: Product[] }) {
  return (
    <>
      <p className="mb-5 text-sm text-stone-600">
        Showing{" "}
        <span className="font-semibold text-stone-900">{products.length}</span>{" "}
        product{products.length === 1 ? "" : "s"}
      </p>

      <section className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </>
  )
}
