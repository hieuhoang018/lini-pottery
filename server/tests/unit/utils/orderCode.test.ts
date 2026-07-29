import { describe, expect, it } from "vitest"
import { formatOrderCode } from "../../../src/utils/orderCode"

describe("formatOrderCode", () => {
  it("pads small values to 6 digits with a DH- prefix", () => {
    expect(formatOrderCode(1)).toBe("DH-000001")
  })

  it("does not truncate values already 6+ digits", () => {
    expect(formatOrderCode(123456)).toBe("DH-123456")
    expect(formatOrderCode(1234567)).toBe("DH-1234567")
  })
})
