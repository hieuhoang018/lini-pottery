import { beforeEach, describe, expect, it, vi } from "vitest"

const { resendMock } = vi.hoisted(() => ({
  resendMock: { emails: { send: vi.fn() } },
}))

vi.mock("../../../src/lib/resend", () => ({ resend: resendMock }))

import { logger } from "../../../src/lib/logger"
import { sendMail } from "../../../src/lib/mailer"

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(logger, "warn").mockImplementation(() => undefined as never)
  vi.spyOn(logger, "error").mockImplementation(() => undefined as never)
})

describe("sendMail", () => {
  it("calls resend.emails.send with the configured from address when RESEND_API_KEY is set", async () => {
    const originalFrom = process.env.EMAIL_FROM
    process.env.EMAIL_FROM = "hello@lini.test"
    resendMock.emails.send.mockResolvedValue({ data: { id: "1" }, error: null })

    await sendMail({ to: "a@b.com", subject: "hi", html: "<p>hi</p>" })

    expect(resendMock.emails.send).toHaveBeenCalledWith({
      from: "hello@lini.test",
      to: "a@b.com",
      subject: "hi",
      html: "<p>hi</p>",
    })

    process.env.EMAIL_FROM = originalFrom
  })

  it("logs an error without throwing when resend returns an error", async () => {
    resendMock.emails.send.mockResolvedValue({ data: null, error: { message: "bad request" } })

    await expect(
      sendMail({ to: "a@b.com", subject: "hi", html: "<p>hi</p>" }),
    ).resolves.toBeUndefined()
    expect(logger.error).toHaveBeenCalled()
  })

  it("logs an error without throwing when resend.emails.send rejects", async () => {
    resendMock.emails.send.mockRejectedValue(new Error("network error"))

    await expect(
      sendMail({ to: "a@b.com", subject: "hi", html: "<p>hi</p>" }),
    ).resolves.toBeUndefined()
    expect(logger.error).toHaveBeenCalled()
  })
})
