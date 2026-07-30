import { beforeEach, describe, expect, it, vi } from "vitest"
import type { NotificationOrder } from "../../../src/services/notification.service"

const { sendTelegramMessageMock } = vi.hoisted(() => ({
  sendTelegramMessageMock: vi.fn(),
}))

vi.mock("../../../src/lib/telegram", () => ({
  sendTelegramMessage: sendTelegramMessageMock,
}))

import { sendAdminNewOrderNotification } from "../../../src/services/notification.service"

const baseOrder: NotificationOrder = {
  orderCode: "DH-000001",
  totalAmount: 100,
  guestName: "Guest User",
  guestEmail: "guest@test.com",
  user: null,
  items: [{ productName: "Vase", quantity: 2, lineTotal: 100 }],
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("sendAdminNewOrderNotification", () => {
  it("sends a Telegram message containing the order code, items, and total", async () => {
    await sendAdminNewOrderNotification(baseOrder)

    expect(sendTelegramMessageMock).toHaveBeenCalledTimes(1)
    const [message] = sendTelegramMessageMock.mock.calls[0]
    expect(message).toContain("DH-000001")
    expect(message).toContain("Vase")
    expect(message).toContain("100đ")
  })

  it("identifies a guest order by guestName/guestEmail", async () => {
    await sendAdminNewOrderNotification(baseOrder)

    const [message] = sendTelegramMessageMock.mock.calls[0]
    expect(message).toContain("Guest User")
    expect(message).toContain("guest@test.com")
    expect(message).toContain("khách vãng lai")
  })

  it("identifies an authenticated order by the user relation", async () => {
    const order: NotificationOrder = { ...baseOrder, user: { name: "Jane", email: "jane@test.com" } }

    await sendAdminNewOrderNotification(order)

    const [message] = sendTelegramMessageMock.mock.calls[0]
    expect(message).toContain("Jane")
    expect(message).toContain("jane@test.com")
    expect(message).toContain("khách hàng đã đăng nhập")
  })

  it("escapes a malicious product name before sending", async () => {
    const order: NotificationOrder = {
      ...baseOrder,
      items: [{ productName: "<script>alert(1)</script>", quantity: 1, lineTotal: 100 }],
    }

    await sendAdminNewOrderNotification(order)

    const [message] = sendTelegramMessageMock.mock.calls[0]
    expect(message).not.toContain("<script>alert(1)</script>")
    expect(message).toContain("&lt;script&gt;alert(1)&lt;/script&gt;")
  })
})
