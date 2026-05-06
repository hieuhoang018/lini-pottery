import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { register } from "../api/authApi"
import { useForm } from "../hooks/useForm"
import { InputField } from "../components/InputField"
import { useEffect } from "react"
import type { RegisterFormInput } from "../types/api-input"

const initialRegisterForm: RegisterFormInput = {
  name: "",
  email: "",
  password: "",
  phone: "",
}

export function RegisterPage() {
  const navigate = useNavigate()

  const { formData, loading, error, handleChange, handleSubmit } =
    useForm<RegisterFormInput>({
      initialData: initialRegisterForm,

      onSubmit: async (data) => {
        await register(data)
        toast.success("Đăng kí tài khoản thành công. Vui lòng đăng nhập.")
        navigate("/login")
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
      <h1 className="text-3xl font-bold text-stone-900">Đăng kí</h1>

      <div className="mt-4 flex flex-col gap-4">
        <InputField
          name="name"
          label="Họ và tên"
          value={formData.name}
          onChange={handleChange}
          isCompulsary
        />

        <InputField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          isCompulsary
        />

        <InputField
          name="phone"
          label="Số điện thoại"
          value={formData.phone}
          onChange={handleChange}
          isCompulsary={false}
        />

        <InputField
          name="password"
          inputType="password"
          label="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          isCompulsary
        />
      </div>

      <button
        disabled={loading}
        className="mt-6 w-full rounded-full bg-amber-800 px-6 py-3 font-semibold text-white"
      >
        Đăng kí
      </button>

      <p className="mt-4 text-sm text-stone-600">
        Đã có tài khoản?{" "}
        <Link to="/login" className="font-semibold text-amber-800">
          Đăng nhập
        </Link>
      </p>
    </form>
  )
}
