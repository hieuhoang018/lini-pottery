import { Link } from "react-router-dom"
import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  PackageCheck,
  Sparkles,
} from "lucide-react"
import { useApiFetch } from "../hooks/useApiFetch"
import { getCategories } from "../api/categoryApi"
import type { Category } from "../types/category"
import { getProducts } from "../api/productApi"
import type { Product } from "../types/product"
import { ProductCard } from "../components/ShopPage/ProductCard"

function getProductImage(product?: Product) {
  return (
    product?.featuredImageUrl || product?.images[0]?.imageUrl || "/logo.png"
  )
}

export function HomePage() {
  const { data: categories, loading: categoriesLoading } = useApiFetch<
    Category[]
  >(() => getCategories(), [])

  const { data: products, loading: productsLoading } = useApiFetch<Product[]>(
    () => getProducts(),
    [],
  )

  const featuredCategories = categories?.slice(0, 4) ?? []
  const featuredProducts = products?.slice(0, 4) ?? []
  const heroProduct = featuredProducts[0]
  const heroImage = getProductImage(heroProduct)

  const loading = categoriesLoading || productsLoading

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-amber-800" />
      </div>
    )
  }

  return (
    <div className="-mx-6 -my-10 bg-stone-50 text-stone-950">
      <section className="relative isolate min-h-[calc(100vh-8rem)] overflow-hidden px-6 py-14 sm:px-10 lg:px-12">
        <img
          src={heroImage}
          alt={heroProduct?.name ?? "Lini Pottery ceramic collection"}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-stone-950/60" />

        <div className="mx-auto flex h-full min-h-[calc(100vh-15rem)] max-w-7xl flex-col justify-end">
          <div className="max-w-3xl pb-10 pt-28 text-white">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Sparkles size={16} />
              Handmade ceramic pieces for everyday rituals
            </p>
            <h1 className="text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
              Lini Pottery
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-100 sm:text-xl">
              Calm, tactile ceramics shaped for warm tables, quiet corners, and
              homes that feel lived in.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-stone-950 transition hover:bg-amber-100"
              >
                Shop the collection
                <ArrowRight size={18} />
              </Link>
              {heroProduct && (
                <Link
                  to={`/products/${heroProduct.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  View featured piece
                </Link>
              )}
            </div>
          </div>

          <div className="grid gap-3 border-t border-white/25 py-5 text-white sm:grid-cols-3">
            {[
              ["Small-batch", "Made in limited runs with careful finishing."],
              ["Functional", "Designed for daily use, gifting, and display."],
              [
                "Considered",
                "Simple forms, grounded tones, lasting materials.",
              ],
            ].map(([title, copy]) => (
              <div key={title}>
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-stone-200">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-16 sm:px-10 lg:grid-cols-3 lg:px-12">
        {[
          {
            icon: BadgeCheck,
            title: "Studio made",
            copy: "Every item is selected for form, finish, and the feeling it brings to a room.",
          },
          {
            icon: PackageCheck,
            title: "Ready to gift",
            copy: "Build a thoughtful present from cups, vases, plates, and home accents.",
          },
          {
            icon: HeartHandshake,
            title: "Made to be used",
            copy: "Durable pieces for shelves, tables, morning coffee, and slow dinners.",
          },
        ].map(({ icon: Icon, title, copy }) => (
          <div
            key={title}
            className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm"
          >
            <Icon className="text-amber-800" size={28} />
            <h2 className="mt-5 text-xl font-semibold">{title}</h2>
            <p className="mt-3 leading-7 text-stone-600">{copy}</p>
          </div>
        ))}
      </section>

      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-amber-800">
                Featured pieces
              </p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                Fresh from the collection
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 font-semibold text-stone-900 hover:text-amber-800"
            >
              Browse all
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {featuredCategories.length > 0 && (
        <section className="bg-white px-6 py-16 sm:px-10 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wide text-amber-800">
                Shop by mood
              </p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                Find the piece that belongs on your table
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredCategories.map((category, index) => {
                const categoryProduct = featuredProducts[index]
                const categoryImage = getProductImage(categoryProduct)

                return (
                  <Link
                    key={category.id}
                    to={`/shop?category=${category.slug || category.name.toLowerCase()}`}
                    className="group relative min-h-72 overflow-hidden rounded-lg bg-stone-200"
                  >
                    <img
                      src={categoryImage}
                      alt={category.name}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-stone-950/35 transition group-hover:bg-stone-950/45" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <h3 className="text-2xl font-semibold">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-stone-100">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-amber-800">
            The studio note
          </p>
          <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
            Objects with a quiet presence
          </h2>
        </div>
        <div className="text-lg leading-8 text-stone-700">
          <p>
            Lini Pottery gathers ceramic pieces that soften the everyday: a cup
            that makes coffee feel slower, a vase that changes a shelf, a bowl
            that asks to stay on the table.
          </p>
          <div className="mt-8">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-900"
            >
              Start shopping
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
