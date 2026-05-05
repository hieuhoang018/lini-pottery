import { useAuth } from "../../contexts/AuthContext"
import { InputField } from "../InputField"
import { useCart } from "../../contexts/CartContext"
import toast from "react-hot-toast"
import { checkoutGuest, checkoutLoggedInUser } from "../../api/orderApi"
import { useNavigate } from "react-router-dom"
import { useForm } from "../../hooks/useForm"
import type { CheckoutFormData } from "../../types/order"
import { useEffect } from "react"

const initialCheckoutForm: CheckoutFormData = {
  guestName: "",
  guestEmail: "",
  guestPhone: "",
  recipientName: "",
  phone: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "Finland",
  additionalInfo: "",
  notes: "",
}

export function InformationForm() {
  const navigate = useNavigate()
  const { items, clearCart } = useCart()
  const { user } = useAuth()

  const { formData, error, loading, handleChange, handleSubmit } =
    useForm<CheckoutFormData>({
      initialData: initialCheckoutForm,
      onSubmit: async (data) => {
        const response = user
          ? await checkoutLoggedInUser({
              recipientName: data.recipientName,
              phone: data.phone,
              streetAddress: data.streetAddress,
              city: data.city,
              postalCode: data.postalCode,
              country: data.country,
              additionalInfo: data.additionalInfo || undefined,
              notes: data.notes || undefined,
            })
          : await checkoutGuest({
              items: items.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
              })),
              guestName: data.guestName,
              guestEmail: data.guestEmail || undefined,
              guestPhone: data.guestPhone,
              recipientName: data.recipientName,
              phone: data.phone,
              streetAddress: data.streetAddress,
              city: data.city,
              postalCode: data.postalCode,
              country: data.country,
              additionalInfo: data.additionalInfo || undefined,
              notes: data.notes || undefined,
            })

        await clearCart()

        toast.success("Đặt hàng thành công")

        navigate("/order-success", {
          state: {
            order: response.order,
            paymentInstruction: response.paymentInstruction,
          },
        })
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
      className="mt-8 space-y-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200"
    >
      {!user && (
        <section>
          <h2 className="text-xl font-semibold">Thông tin khách hàng</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <InputField
              label="Tên"
              inputType="text"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              isCompulsary
            />

            <InputField
              label="Số điện thoại"
              inputType="text"
              name="guestPhone"
              value={formData.guestPhone}
              onChange={handleChange}
              isCompulsary
            />

            <div className="md:col-span-2">
              <InputField
                label="Email"
                inputType="email"
                name="guestEmail"
                value={formData.guestEmail}
                onChange={handleChange}
                isCompulsary={false}
              />
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold">Địa chỉ giao hàng</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <InputField
            label="Tên người nhận"
            inputType="text"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            isCompulsary
          />

          <InputField
            label="Số điện thoại"
            inputType="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            isCompulsary
          />

          <div className="md:col-span-2">
            <InputField
              label="Địa chỉ nhà"
              inputType="text"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              isCompulsary
            />
          </div>

          <InputField
            label="Thành phố"
            inputType="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            isCompulsary
          />

          <InputField
            label="Mã bưu điện"
            inputType="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            isCompulsary
          />

          <InputField
            label="Quốc gia"
            inputType="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            isCompulsary
          />

          <InputField
            label="Thông tin bổ sung"
            inputType="text"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            isCompulsary={false}
          />

          <div className="md:col-span-2">
            <InputField
              label="Ghi chú"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              isCompulsary={false}
            />
          </div>
        </div>
      </section>

      <button
        disabled={loading}
        className="w-full rounded-full bg-amber-800 px-6 py-3 font-semibold text-white hover:bg-amber-900 disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        {loading ? "Đang đặt hàng..." : "Đặt hàng"}
      </button>
    </form>
  )
}
