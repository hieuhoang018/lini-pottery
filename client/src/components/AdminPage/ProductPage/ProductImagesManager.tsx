import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import {
  createProductImage,
  deleteProductImage,
  getProductImages,
} from "../../../api/productImageApi"
import { updateProduct } from "../../../api/productApi"
import { uploadProductImage } from "../../../api/uploadApi"
import type { Product, ProductImage } from "../../../types/product"
import { ProductImagesSkeleton } from "../../skeletons/AdminProductDetailSkeleton"

type ProductImagesManagerProps = {
  product: Product
  productId: string
}

type GalleryDraft = {
  imageUrl: string
  publicId: string
  altText: string
  sortOrder: number
}

export function ProductImagesManager({
  product,
  productId,
}: ProductImagesManagerProps) {
  const [images, setImages] = useState<ProductImage[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [featuredUploading, setFeaturedUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)

  const [featuredImage, setFeaturedImage] = useState({
    imageUrl: product.featuredImageUrl || "",
    publicId: product.featuredImagePublicId || "",
  })

  const [galleryDraft, setGalleryDraft] = useState<GalleryDraft>({
    imageUrl: "",
    publicId: "",
    altText: "",
    sortOrder: 0,
  })

  const fetchImages = async () => {
    try {
      setLoading(true)
      const data = await getProductImages(productId)
      setImages(data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load images")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [productId])

  useEffect(() => {
    setFeaturedImage({
      imageUrl: product.featuredImageUrl || "",
      publicId: product.featuredImagePublicId || "",
    })
  }, [product.featuredImageUrl, product.featuredImagePublicId])

  useEffect(() => {
    setGalleryDraft((prev) => ({
      ...prev,
      sortOrder: images.length,
    }))
  }, [images.length])

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
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Không thể cập nhật ảnh đại diện",
      )
    } finally {
      setFeaturedUploading(false)
      event.target.value = ""
    }
  }

  const handleGalleryImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    try {
      setGalleryUploading(true)

      const uploadedImage = await uploadProductImage(file)

      setGalleryDraft((prev) => ({
        ...prev,
        imageUrl: uploadedImage.imageUrl,
        publicId: uploadedImage.publicId,
      }))

      toast.success("Đã tải ảnh thư viện lên")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể tải ảnh lên")
    } finally {
      setGalleryUploading(false)
      event.target.value = ""
    }
  }

  const handleAddImage = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!galleryDraft.imageUrl || !galleryDraft.publicId) {
      toast.error("Vui lòng tải ảnh lên trước")
      return
    }

    try {
      setAdding(true)

      await createProductImage(productId, {
        imageUrl: galleryDraft.imageUrl,
        publicId: galleryDraft.publicId,
        altText: galleryDraft.altText || undefined,
        sortOrder: Number(galleryDraft.sortOrder),
      })

      toast.success("Đã thêm ảnh vào thư viện")

      setGalleryDraft({
        imageUrl: "",
        publicId: "",
        altText: "",
        sortOrder: images.length + 1,
      })

      fetchImages()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add image")
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    const confirmed = window.confirm("Delete this image?")
    if (!confirmed) return

    try {
      await deleteProductImage(imageId)

      toast.success("Đã xóa ảnh")
      fetchImages()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete image")
    }
  }

  return (
    <div className="mt-4 space-y-6">
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

      <section className="rounded-2xl bg-stone-50 p-4">
        <h4 className="font-semibold text-stone-900">Thư viện hình ảnh</h4>

        {loading ? (
          <ProductImagesSkeleton />
        ) : images.length === 0 ? (
          <p className="mt-3 text-sm text-stone-600">Chưa có ảnh.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-xl bg-white ring-1 ring-stone-200"
              >
                <img
                  src={image.imageUrl}
                  alt={image.altText || "Product image"}
                  className="h-28 w-full bg-stone-200 object-cover"
                />

                <div className="p-3">
                  <p className="text-xs text-stone-500">
                    Thứ tự: {image.sortOrder}
                  </p>

                  {image.altText && (
                    <p className="mt-1 line-clamp-1 text-xs text-stone-600">
                      {image.altText}
                    </p>
                  )}

                  {image.publicId && (
                    <p className="mt-1 line-clamp-1 text-xs text-stone-400">
                      {image.publicId}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image.id)}
                    className="mt-3 text-xs font-semibold text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddImage} className="mt-5 grid gap-3">
          <label className="block text-sm font-medium text-stone-700">
            Tải ảnh thư viện
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleGalleryImageUpload}
              className="mt-2 block w-full rounded-xl border border-stone-300 px-4 py-3 text-sm"
            />
          </label>

          {galleryUploading && (
            <p className="text-sm text-stone-500">Đang tải ảnh lên...</p>
          )}

          {galleryDraft.imageUrl && (
            <div className="rounded-xl bg-white p-3 ring-1 ring-stone-200">
              <img
                src={galleryDraft.imageUrl}
                alt="Gallery draft preview"
                className="h-40 w-full rounded-lg bg-stone-200 object-cover"
              />

              <p className="mt-2 break-all text-xs text-stone-500">
                {galleryDraft.imageUrl}
              </p>

              <p className="mt-1 break-all text-xs text-stone-400">
                {galleryDraft.publicId}
              </p>
            </div>
          )}

          <label className="block text-sm font-medium text-stone-700">
            Alt text
            <input
              value={galleryDraft.altText}
              onChange={(e) =>
                setGalleryDraft((prev) => ({
                  ...prev,
                  altText: e.target.value,
                }))
              }
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-2"
              placeholder="Front view of blue mug"
            />
          </label>

          <label className="block text-sm font-medium text-stone-700">
            Sort order
            <input
              type="number"
              value={galleryDraft.sortOrder}
              onChange={(e) =>
                setGalleryDraft((prev) => ({
                  ...prev,
                  sortOrder: Number(e.target.value),
                }))
              }
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-2"
            />
          </label>

          <button
            disabled={adding || galleryUploading || !galleryDraft.imageUrl}
            className="rounded-full bg-amber-800 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-900 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {adding ? "Đang thêm..." : "Thêm hình ảnh"}
          </button>
        </form>
      </section>
    </div>
  )
}
