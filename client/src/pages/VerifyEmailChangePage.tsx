import { useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { confirmEmailChange } from "../api/profileApi"
import { useApiFetch } from "../hooks/useApiFetch"
import { useAuth } from "../contexts/AuthContext"
import type { User } from "../types/auth"

export function VerifyEmailChangePage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const { user, refreshUser } = useAuth()

  const { data, loading } = useApiFetch<User>(async () => {
    if (!token) {
      throw new Error("Missing token")
    }

    return confirmEmailChange(token)
  }, [token])

  useEffect(() => {
    if (data && user) {
      refreshUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-stone-200">
      <h1 className="text-2xl font-bold text-stone-900">Xác nhận đổi email</h1>

      <p className="mt-4 text-stone-600">
        {loading
          ? "Đang xác nhận..."
          : data
            ? "Email của bạn đã được xác nhận và cập nhật thành công."
            : "Liên kết xác nhận không hợp lệ hoặc đã hết hạn."}
      </p>

      <Link
        to="/account"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900"
      >
        Về trang tài khoản
      </Link>
    </div>
  )
}
