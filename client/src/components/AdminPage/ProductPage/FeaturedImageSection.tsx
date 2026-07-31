import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { updateProduct } from "../../../api/productApi"
import { uploadProductImage } from "../../../api/uploadApi"
import { getErrorMessage } from "../../../utils/getErrorMessage"
import type { Product } from "../../../types/product"

type FeaturedImageSectionProps = {
  product: Product
  productId: string
}

export function FeaturedImageSection({
  product,
  productId,
}: FeaturedImageSectionProps) {
  const [featuredUploading, setFeaturedUploading] = useState(false)

  const [featuredImage, setFeaturedImage] = useState({
    imageUrl: product.featuredImageUrl || "",
    publicId: product.featuredImagePublicId || "",
  })

  useEffect(() => {
    setFeaturedImage({
      imageUrl: product.featuredImageUrl || "",
      publicId: product.featuredImagePublicId || "",
    })
  }, [product.featuredImageUrl, product.featuredImagePublicId])

  const handleFeaturedImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    try {
      setFeaturedUploading(true)

      const uploadedImage = await uploadProductImage(file)

      await updateProduct(productId, {
        featuredImageUrl: uploadedImage.imageUrl,
        featuredImagePublicId: uploadedImage.publicId,
      })

      setFeaturedImage({
        imageUrl: uploadedImage.imageUrl,
        publicId: uploadedImage.publicId,
      })

      toast.success("Đã cập nhật ảnh đại diện sản phẩm")
    } catch (err) {
      toast.error(getErrorMessage(err, "Không thể cập nhật ảnh đại diện"))
    } finally {
      setFeaturedUploading(false)
      event.target.value = ""
    }
  }

  return (
    <section className="rounded-2xl bg-stone-50 p-4">
      <h4 className="font-semibold text-stone-900">Ảnh đại diện sản phẩm</h4>

      {featuredImage.imageUrl ? (
        <div className="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-stone-200">
          <img
            src={featuredImage.imageUrl}
            alt={product.name}
            className="h-56 w-full bg-stone-200 object-cover"
          />

          {featuredImage.publicId && (
            <div className="p-3">
              <p className="break-all text-xs text-stone-400">
                Cloudinary ID: {featuredImage.publicId}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm text-stone-600">
          Sản phẩm chưa có ảnh đại diện.
        </p>
      )}

      <label className="mt-4 block text-sm font-medium text-stone-700">
        Tải ảnh đại diện mới
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFeaturedImageUpload}
          className="mt-2 block w-full rounded-xl border border-stone-300 px-4 py-3 text-sm"
        />
      </label>

      {featuredUploading && (
        <p className="mt-2 text-sm text-stone-500">Đang tải ảnh lên...</p>
      )}
    </section>
  )
}
