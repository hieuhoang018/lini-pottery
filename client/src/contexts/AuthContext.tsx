import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { getCurrentUser, logoutApi, refreshToken } from "../api/authApi"
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
    }
  }

  const restoreSession = async () => {
    try {
      const storedToken = localStorage.getItem("token")

      if (storedToken) {
        await fetchUser()
        return
      }

      const result = await refreshToken()

      localStorage.setItem("token", result.accessToken)
      setUser(result.user)
    } catch {
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    restoreSession()
  }, [])

  const login = async (accessToken: string, loggedInUser?: User) => {
    localStorage.setItem("token", accessToken)

    if (loggedInUser) {
      setUser(loggedInUser)
      return
    }

    await fetchUser()
  }

  const logout = async () => {
    try {
      await logoutApi()
    } catch {
      // Even if backend logout fails, clear frontend auth state
    } finally {
      localStorage.removeItem("token")
      setUser(null)
    }
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
