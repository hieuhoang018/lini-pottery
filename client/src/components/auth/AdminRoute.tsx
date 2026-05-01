import { Navigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

type AdminRouteProps = {
  children: React.ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <p className="mx-auto max-w-7xl text-stone-600">Loading...</p>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />
  }

  return children
}
