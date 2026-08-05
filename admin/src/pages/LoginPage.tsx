import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { login as loginApi } from "../api/authApi"
import { useAuth } from "../contexts/AuthContext"
import { InputField } from "../components/InputField"
import { useForm } from "../hooks/useForm"
import { useEffect } from "react"

export function LoginPage() {
  const navigate = useNavigate()
  const { login, logout } = useAuth()

  const { formData, handleChange, error, handleSubmit, loading } = useForm({
    initialData: {
      email: "",
      password: "",
    },

    onSubmit: async (data) => {
      const result = await loginApi(data)

      if (result.user.role !== "ADMIN") {
        toast.error("Tài khoản này không có quyền quản trị")
        return
      }

      await login(result.accessToken, result.user)

      toast.success("Đăng nhập thành công")
      navigate("/")
    },
  })

  useEffect(() => {
    if (error) {
      toast.error(error)
      logout()
    }
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200"
      >
        <h1 className="text-3xl font-bold text-stone-900">Lini Admin</h1>
        <p className="mt-2 text-sm text-stone-600">
          Đăng nhập với tài khoản quản trị viên.
        </p>

        <div className="mt-7">
          <InputField
            label="Email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            inputType="email"
            name="email"
            isCompulsary
          />
        </div>
        <div className="mt-4">
          <InputField
            label="Mật khẩu"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            inputType="password"
            name="password"
            isCompulsary
          />
        </div>

        <button
          className="mt-6 w-full rounded-full bg-stone-900 px-6 py-3 font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          disabled={loading}
        >
          Đăng nhập
        </button>
      </form>
    </main>
  )
}
