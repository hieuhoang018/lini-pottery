import multer from "multer"
import { AppError } from "../utils/AppError"

const storage = multer.memoryStorage()

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"]

  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(
      new AppError(
        "Only JPG, PNG, and WEBP images are allowed",
        400,
        "INVALID_IMAGE_TYPE",
      ),
    )
    return
  }

  cb(null, true)
}

export const uploadProductImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})
