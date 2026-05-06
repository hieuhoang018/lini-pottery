import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { login as loginApi } from "../api/authApi"
import { useAuth } from "../contexts/AuthContext"
import { InputField } from "../components/InputField"
import { useForm } from "../hooks/useForm"
import { useEffect } from "react"

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const { formData, handleChange, error, handleSubmit, loading } = useForm({
    initialData: {
      email: "",
      password: "",
    },

    onSubmit: async (data) => {
      const result = await loginApi(data)

      await login(result.token)

      localStorage.removeItem("guest_cart")

      toast.success("Đăng nhập thành công")
      navigate("/")
    },
  })

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200"
    >
      <h1 className="text-3xl font-bold text-stone-900">Đăng nhập</h1>
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
        className="mt-6 w-full rounded-full bg-amber-800 hover:bg-amber-900 px-6 py-3 font-semibold text-white"
        disabled={loading}
      >
        Đăng nhập
      </button>

      <p className="mt-4 text-sm text-stone-600">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="font-semibold text-amber-800">
          Đăng kí
        </Link>
      </p>
    </form>
  )
}
