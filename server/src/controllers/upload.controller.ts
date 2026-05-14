import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import { AppError } from "../utils/AppError"
import {
  uploadBufferToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinaryUpload"

export const uploadProductImageHandler = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError("No image uploaded", 400, "NO_IMAGE_UPLOADED")
    }

    const uploadedImage = await uploadBufferToCloudinary(
      req.file.buffer,
      "lini/products",
    )

    return res.status(201).json({
      imageUrl: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    })
  },
)

export const deleteUploadedImageHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { publicId } = req.body

    if (!publicId) {
      throw new AppError("publicId is required", 400, "PUBLIC_ID_REQUIRED")
    }

    await deleteImageFromCloudinary(publicId)

    return res.status(200).json({
      message: "Image deleted",
    })
  },
)
