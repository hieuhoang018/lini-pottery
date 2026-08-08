import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { getCurrentUser, logoutApi, refreshToken } from "../api/authApi"
import { setAccessToken } from "../api/tokenStore"
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
      setAccessToken(null)
      setUser(null)
    }
  }

  const restoreSession = async () => {
    try {
      const result = await refreshToken()

      setAccessToken(result.accessToken)
      setUser(result.user)
    } catch {
      setAccessToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    restoreSession()
  }, [])

  const login = async (accessToken: string, loggedInUser?: User) => {
    setAccessToken(accessToken)

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
      setAccessToken(null)
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
        refreshUser: fetchUser,
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
