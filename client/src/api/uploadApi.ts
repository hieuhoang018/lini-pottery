import type { UploadImageResponse } from "../types/response"
import { apiClient } from "./apiClient"

export const uploadProductImage = async (file: File) => {
  const formData = new FormData()

  formData.append("image", file)

  const { data } = await apiClient.post<UploadImageResponse>(
    "/uploads/product-image",
    formData,
  )

  return data
}
