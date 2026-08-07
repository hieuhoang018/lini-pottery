import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("../../../src/lib/resend", () => ({ resend: null }))

import { logger } from "../../../src/lib/logger"
import { sendMail } from "../../../src/lib/mailer"

beforeEach(() => {
  vi.spyOn(logger, "warn").mockImplementation(() => undefined as never)
})

describe("sendMail without a configured Resend client", () => {
  it("logs a warning and skips sending", async () => {
    await sendMail({ to: "a@b.com", subject: "hi", html: "<p>hi</p>" })

    expect(logger.warn).toHaveBeenCalled()
  })
})
