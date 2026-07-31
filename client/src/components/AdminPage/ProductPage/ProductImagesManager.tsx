import type { Product } from "../../../types/product"
import { FeaturedImageSection } from "./FeaturedImageSection"
import { GalleryImagesSection } from "./GalleryImagesSection"

type ProductImagesManagerProps = {
  product: Product
  productId: string
}

export function ProductImagesManager({
  product,
  productId,
}: ProductImagesManagerProps) {
  return (
    <div className="mt-4 space-y-6">
      <FeaturedImageSection product={product} productId={productId} />
      <GalleryImagesSection productId={productId} />
    </div>
  )
}
