export type User = {
  id: string
  name: string
  email: string
  role: "CUSTOMER" | "ADMIN"
  phone?: string | null
  createdAt: string
}

export type AuthContextType = {
  user: User | null
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

