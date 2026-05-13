import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import { AppError } from "../utils/AppError"
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload"

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
