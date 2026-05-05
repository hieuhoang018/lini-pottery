import type { OrderSuccessState } from "../../types/order"

export function PaymentInstructions({
  paymentInstruction,
}: {
  paymentInstruction: OrderSuccessState["paymentInstruction"]
}) {
  return (
    <section className="mt-6 rounded-2xl bg-amber-50 p-5 text-amber-950">
      <h2 className="text-lg font-semibold">Hướng dẫn thanh toán</h2>

      <p className="mt-2 text-sm">
        {paymentInstruction?.note ||
          "Vui lòng quét mã QR hoặc chuyển khoản vào tài khoản ngân hàng được cung cấp. Quản trị viên sẽ xác nhận thanh toán thủ công."}
      </p>

      <div className="mt-5 rounded-2xl border border-dashed border-amber-300 bg-white p-6 text-center">
        <p className="font-semibold">Bank QR code placeholder</p>
        <p className="mt-2 text-sm text-stone-600">
          Add your real bank QR image here later.
        </p>
      </div>

      <div className="mt-5 rounded-xl bg-white p-4 text-sm text-stone-700">
        <p>
          <span className="font-semibold">Phương thức thanh toán:</span>{" "}
          {paymentInstruction?.method || "BANK_QR"}
        </p>
        {/* <p className="mt-2">
                <span className="font-semibold">Reference:</span> Please include
                your order ID in the transfer message.
              </p> */}
      </div>
    </section>
  )
}
