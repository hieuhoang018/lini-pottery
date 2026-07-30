import { sendTelegramMessage } from "../lib/telegram"
import { escapeHtml } from "../utils/escapeHtml"
import { formatCurrency } from "../utils/formatCurrency"

export type NotificationOrder = {
  orderCode: string
  totalAmount: unknown
  guestName?: string | null
  guestEmail?: string | null
  user: { name: string; email: string } | null
  items: { productName: string; quantity: number; lineTotal: unknown }[]
}

const buildAdminNewOrderMessage = (order: NotificationOrder): string => {
  const customerName = order.user?.name ?? order.guestName ?? "Khách"
  const customerEmail = order.user?.email ?? order.guestEmail ?? "(không có email)"
  const orderType = order.user ? "khách hàng đã đăng nhập" : "khách vãng lai"

  const itemLines = order.items
    .map(
      (item) =>
        `• ${escapeHtml(item.productName)} x${item.quantity} — ${formatCurrency(item.lineTotal)}`,
    )
    .join("\n")

  return [
    `<b>🛒 Đơn hàng mới #${escapeHtml(order.orderCode)}</b>`,
    `Từ ${escapeHtml(orderType)}`,
    "",
    `<b>Khách hàng:</b> ${escapeHtml(customerName)}`,
    `<b>Email:</b> ${escapeHtml(customerEmail)}`,
    "",
    itemLines,
    "",
    `<b>Tổng cộng:</b> ${formatCurrency(order.totalAmount)}`,
    "",
    "Vui lòng theo dõi chuyển khoản và xác nhận thanh toán trong trang quản trị.",
  ].join("\n")
}

export const sendAdminNewOrderNotification = async (order: NotificationOrder): Promise<void> => {
  await sendTelegramMessage(buildAdminNewOrderMessage(order))
}
