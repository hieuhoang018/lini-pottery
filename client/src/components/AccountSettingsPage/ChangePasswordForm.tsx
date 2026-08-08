import { useEffect } from "react"
import toast from "react-hot-toast"
import { InputField } from "../InputField"
import { useForm } from "../../hooks/useForm"
import { changePassword } from "../../api/profileApi"

export function ChangePasswordForm() {
  const { formData, handleChange, error, handleSubmit, loading, setFormData } =
    useForm({
      initialData: { currentPassword: "", newPassword: "" },

      onSubmit: async (data) => {
        await changePassword(data)
        setFormData({ currentPassword: "", newPassword: "" })
        toast.success("Đổi mật khẩu thành công")
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
      <h2 className="text-xl font-bold text-stone-900">Đổi mật khẩu</h2>

      <div className="mt-4 flex flex-col gap-4">
        <InputField
          name="currentPassword"
          label="Mật khẩu hiện tại"
          inputType="password"
          value={formData.currentPassword}
          onChange={handleChange}
          isCompulsary
        />

        <InputField
          name="newPassword"
          label="Mật khẩu mới"
          inputType="password"
          value={formData.newPassword}
          onChange={handleChange}
          isCompulsary
        />
      </div>

      <button
        disabled={loading}
        className="mt-6 rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900"
      >
        Đổi mật khẩu
      </button>
    </form>
  )
}
