import type { User } from "./auth"

export type AuthResponse = {
  user: User
  accessToken: string
}

export type UploadImageResponse = {
  imageUrl: string
  publicId: string
}
