import { describe, expect, it } from "vitest"
import {
  buildProductSearchText,
  normalizeSearchText,
} from "../../../src/utils/search"

describe("normalizeSearchText", () => {
  it("lowercases and strips diacritics", () => {
    expect(normalizeSearchText("Bình Gốm Đẹp")).toBe("binh gom dep")
  })

  it("collapses punctuation and repeated whitespace", () => {
    expect(normalizeSearchText("  Ceramic --- Vase!!  ")).toBe(
      "ceramic vase",
    )
  })
})

describe("buildProductSearchText", () => {
  it("joins and normalizes present fields, skipping nullish ones", () => {
    expect(
      buildProductSearchText({
        name: "Bình Gốm",
        slug: "binh-gom",
        description: null,
        material: "Clay",
        color: undefined,
        categoryName: "Vases",
      }),
    ).toBe("binh gom binh gom clay vases")
  })
})
