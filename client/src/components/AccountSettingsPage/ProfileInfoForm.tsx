import { useEffect } from "react"
import toast from "react-hot-toast"
import { InputField } from "../InputField"
import { useForm } from "../../hooks/useForm"
import { useAuth } from "../../contexts/AuthContext"
import { updateProfile } from "../../api/profileApi"
import type { UpdateProfileFormInput } from "../../types/api-input"

export function ProfileInfoForm() {
  const { user, refreshUser } = useAuth()

  const { formData, handleChange, error, handleSubmit, loading } =
    useForm<UpdateProfileFormInput>({
      initialData: {
        name: user?.name ?? "",
        phone: user?.phone ?? "",
      },

      onSubmit: async (data) => {
        await updateProfile(data)
        await refreshUser()
        toast.success("Cập nhật thông tin thành công")
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
      <h2 className="text-xl font-bold text-stone-900">Thông tin cá nhân</h2>

      <div className="mt-4 flex flex-col gap-4">
        <InputField
          name="name"
          label="Họ và tên"
          value={formData.name}
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
      </div>

      <button
        disabled={loading}
        className="mt-6 rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900"
      >
        Lưu thay đổi
      </button>
    </form>
  )
}
