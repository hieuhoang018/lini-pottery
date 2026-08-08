import { ProfileInfoForm } from "../components/AccountSettingsPage/ProfileInfoForm"
import { ChangeEmailForm } from "../components/AccountSettingsPage/ChangeEmailForm"
import { ChangePasswordForm } from "../components/AccountSettingsPage/ChangePasswordForm"

export function AccountSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold">Tài khoản của tôi</h1>
      <p className="mt-2 text-sm text-stone-600">
        Cập nhật thông tin cá nhân, email và mật khẩu của bạn.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <ProfileInfoForm />
        <ChangeEmailForm />
        <ChangePasswordForm />
      </div>
    </div>
  )
}
