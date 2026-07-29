import { describe, expect, it } from "vitest"
import { isValidUuid } from "../../../src/utils/isValidUuid"

describe("isValidUuid", () => {
  it("accepts a valid v4 uuid", () => {
    expect(isValidUuid("6b3f1e2a-4c3d-4e2f-8a9b-1c2d3e4f5a6b")).toBe(true)
  })

  it("rejects a non-uuid string", () => {
    expect(isValidUuid("not-a-uuid")).toBe(false)
  })

  it("rejects an empty string", () => {
    expect(isValidUuid("")).toBe(false)
  })

  it("rejects a uuid with the wrong version nibble", () => {
    expect(isValidUuid("6b3f1e2a-4c3d-9e2f-8a9b-1c2d3e4f5a6b")).toBe(false)
  })
})
