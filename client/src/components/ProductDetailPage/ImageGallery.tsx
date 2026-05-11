import { useMemo, useState } from "react"
import type { Product } from "../../types/product"

export function ImageGallery({ product }: { product: Product }) {
  const images = useMemo(
    () => [
      ...(product.featuredImageUrl
        ? [
            {
              id: "featured",
              imageUrl: product.featuredImageUrl,
              altText: product.name,
            },
          ]
        : []),
      ...product.images,
    ],
    [product],
  )

  const [selectedImage, setSelectedImage] = useState(
    images[0]?.imageUrl || "/placeholder.png",
  )

  return (
    <div>
      <img
        src={selectedImage}
        alt={product.name}
        className="h-130 w-full rounded-3xl bg-stone-200 object-cover"
      />

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image.imageUrl)}
              className={`overflow-hidden rounded-xl border ${
                selectedImage === image.imageUrl
                  ? "border-amber-800"
                  : "border-stone-200"
              }`}
            >
              <img
                src={image.imageUrl}
                alt={image.altText || product.name}
                className="h-20 w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
