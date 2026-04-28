import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { getCurrentUser } from "../api/authApi"
import type { AuthContextType, User } from "../types/auth"

const AuthContext = createContext<AuthContextType | null>(null)

type Props = {
  children: ReactNode
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch {
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      setLoading(false)
      return
    }

    fetchUser()
  }, [])

  const login = async (token: string) => {
    localStorage.setItem("token", token)
    await fetchUser()
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}
