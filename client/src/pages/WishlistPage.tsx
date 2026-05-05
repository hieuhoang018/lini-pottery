import { MainWishlistSection } from "../components/WishlistPage/MainWishlistSection"

export function WishlistPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl mb-8 font-bold">Danh sách yêu thích</h1>

      <MainWishlistSection />
    </div>
  )
}
