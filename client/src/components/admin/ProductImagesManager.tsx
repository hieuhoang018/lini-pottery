import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import {
  createProductImage,
  deleteProductImage,
  getProductImages,
} from "../../api/productImageApi"
import type { ProductImage } from "../../types/product"

type ProductImagesManagerProps = {
  productId: string
}

export function ProductImagesManager({ productId }: ProductImagesManagerProps) {
  const [images, setImages] = useState<ProductImage[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const [form, setForm] = useState({
    imageUrl: "",
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

  const handleAddImage = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!form.imageUrl) {
      toast.error("Image URL is required")
      return
    }

    try {
      setAdding(true)

      await createProductImage(productId, {
        imageUrl: form.imageUrl,
        altText: form.altText || undefined,
        sortOrder: Number(form.sortOrder),
      })

      toast.success("Image added")

      setForm({
        imageUrl: "",
        altText: "",
        sortOrder: images.length,
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
      toast.success("Image deleted")
      fetchImages()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete image")
    }
  }

  return (
    <div className="mt-4 rounded-2xl bg-stone-50 p-4">
      <h4 className="font-semibold text-stone-900">Thư viện hình ảnh</h4>

      {loading ? (
        <p className="mt-3 text-sm text-stone-600">Loading images...</p>
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

                <button
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
          Image URL *
          <input
            value={form.imageUrl}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
            }
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-2"
            placeholder="https://example.com/image.jpg"
          />
        </label>

        <label className="block text-sm font-medium text-stone-700">
          Alt text
          <input
            value={form.altText}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, altText: e.target.value }))
            }
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-2"
            placeholder="Front view of blue mug"
          />
        </label>

        <label className="block text-sm font-medium text-stone-700">
          Sort order
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                sortOrder: Number(e.target.value),
              }))
            }
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-2"
          />
        </label>

        <button
          disabled={adding}
          className="rounded-full bg-amber-800 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-900 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {adding ? "Đang thêm..." : "Thêm hình ảnh"}
        </button>
      </form>
    </div>
  )
}
