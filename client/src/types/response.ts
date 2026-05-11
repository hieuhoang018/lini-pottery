import type { User } from "./auth"

export type AuthResponse = {
  user: User
  accessToken: string
}
