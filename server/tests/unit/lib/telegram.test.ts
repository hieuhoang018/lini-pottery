import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { sendTelegramMessage } from "../../../src/lib/telegram"

const originalToken = process.env.TELEGRAM_BOT_TOKEN
const originalChatId = process.env.TELEGRAM_ADMIN_CHAT_ID

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {})
  vi.spyOn(console, "error").mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  process.env.TELEGRAM_BOT_TOKEN = originalToken
  process.env.TELEGRAM_ADMIN_CHAT_ID = originalChatId
})

describe("sendTelegramMessage", () => {
  it("skips sending when TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID is unset", async () => {
    delete process.env.TELEGRAM_BOT_TOKEN
    delete process.env.TELEGRAM_ADMIN_CHAT_ID
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    await sendTelegramMessage("hello")

    expect(fetchMock).not.toHaveBeenCalled()
    expect(console.warn).toHaveBeenCalled()
  })

  it("posts to the Telegram API with the configured token and chat id", async () => {
    process.env.TELEGRAM_BOT_TOKEN = "test-token"
    process.env.TELEGRAM_ADMIN_CHAT_ID = "12345"
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    })
    vi.stubGlobal("fetch", fetchMock)

    await sendTelegramMessage("hello world")

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.telegram.org/bottest-token/sendMessage",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          chat_id: "12345",
          text: "hello world",
          parse_mode: "HTML",
        }),
      }),
    )
  })

  it("logs without throwing when the Telegram API returns an error", async () => {
    process.env.TELEGRAM_BOT_TOKEN = "test-token"
    process.env.TELEGRAM_ADMIN_CHAT_ID = "12345"
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ ok: false, description: "bad request" }),
    })
    vi.stubGlobal("fetch", fetchMock)

    await expect(sendTelegramMessage("hello")).resolves.toBeUndefined()
    expect(console.error).toHaveBeenCalled()
  })

  it("logs without throwing when fetch rejects", async () => {
    process.env.TELEGRAM_BOT_TOKEN = "test-token"
    process.env.TELEGRAM_ADMIN_CHAT_ID = "12345"
    const fetchMock = vi.fn().mockRejectedValue(new Error("network error"))
    vi.stubGlobal("fetch", fetchMock)

    await expect(sendTelegramMessage("hello")).resolves.toBeUndefined()
    expect(console.error).toHaveBeenCalled()
  })
})
