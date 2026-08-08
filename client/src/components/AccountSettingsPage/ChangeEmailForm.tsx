import { useEffect } from "react"
import toast from "react-hot-toast"
import { InputField } from "../InputField"
import { useForm } from "../../hooks/useForm"
import { useAuth } from "../../contexts/AuthContext"
import { requestEmailChange } from "../../api/profileApi"

export function ChangeEmailForm() {
  const { user, refreshUser } = useAuth()

  const { formData, handleChange, error, handleSubmit, loading, setFormData } =
    useForm({
      initialData: { newEmail: "", currentPassword: "" },

      onSubmit: async (data) => {
        await requestEmailChange(data)
        await refreshUser()
        setFormData({ newEmail: "", currentPassword: "" })
        toast.success("Đã gửi email xác nhận, vui lòng kiểm tra hộp thư của bạn")
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
      className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200"
    >
      <h2 className="text-xl font-bold text-stone-900">Đổi email</h2>
      <p className="mt-1 text-sm text-stone-600">Email hiện tại: {user?.email}</p>

      {user?.pendingEmail && (
        <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          Đang chờ xác nhận đổi email sang <strong>{user.pendingEmail}</strong>.
          Vui lòng kiểm tra hộp thư để hoàn tất.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-4">
        <InputField
          name="newEmail"
          label="Email mới"
          inputType="email"
          value={formData.newEmail}
          onChange={handleChange}
          isCompulsary
        />

        <InputField
          name="currentPassword"
          label="Mật khẩu hiện tại"
          inputType="password"
          value={formData.currentPassword}
          onChange={handleChange}
          isCompulsary
        />
      </div>

      <button
        disabled={loading}
        className="mt-6 rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900"
      >
        Đổi email
      </button>
    </form>
  )
}
