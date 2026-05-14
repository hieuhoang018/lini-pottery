import type { UploadApiResponse } from "cloudinary"
import { cloudinary } from "../lib/cloudinary"

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder = "lini/products",
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed"))
          return
        }

        resolve(result)
      },
    )

    uploadStream.end(buffer)
  })
}

export const deleteImageFromCloudinary = async (publicId?: string | null) => {
  if (!publicId) return null

  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  })
}
