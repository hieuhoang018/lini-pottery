import type { User } from "./auth"

export type LoginResponse = {
  token: string
  user: User
}
