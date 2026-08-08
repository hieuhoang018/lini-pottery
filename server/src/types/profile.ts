export type UpdateProfileInput = {
  name?: string
  phone?: string
}

export type ChangePasswordInput = {
  currentPassword: string
  newPassword: string
}

export type RequestEmailChangeInput = {
  newEmail: string
  currentPassword: string
}
