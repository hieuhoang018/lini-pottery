export type User = {
  id: string
  name: string
  email: string
  role: "CUSTOMER" | "ADMIN"
  phone?: string | null
  pendingEmail?: string | null
  createdAt: string
}

export type AuthContextType = {
  user: User | null
  loading: boolean
  login: (accessToken: string, user?: User) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}
