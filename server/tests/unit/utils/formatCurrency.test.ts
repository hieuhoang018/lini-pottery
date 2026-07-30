import { describe, expect, it } from "vitest"
import { formatCurrency } from "../../../src/utils/formatCurrency"

describe("formatCurrency", () => {
  it("formats a number as VND with the đ suffix, no decimals", () => {
    expect(formatCurrency(150000)).toBe("150000đ")
  })

  it("rounds Decimal-like string values", () => {
    expect(formatCurrency("99.6")).toBe("100đ")
  })
})
