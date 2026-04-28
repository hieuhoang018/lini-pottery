import { Navigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

type ProtectedRouteProps = {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-10">
        <div className="mx-auto max-w-7xl text-stone-600">Loading...</div>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
