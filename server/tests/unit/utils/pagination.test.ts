import { describe, expect, it } from "vitest"
import { buildPaginationMeta, getPaginationParams } from "../../../src/utils/pagination"

describe("getPaginationParams", () => {
  it("defaults to page 1, limit 10", () => {
    expect(getPaginationParams({})).toEqual({ page: 1, limit: 10, skip: 0 })
  })

  it("clamps page below 1 up to 1", () => {
    expect(getPaginationParams({ page: "0" })).toMatchObject({ page: 1 })
    expect(getPaginationParams({ page: "-5" })).toMatchObject({ page: 1 })
  })

  it("clamps limit above 100 down to 100", () => {
    expect(getPaginationParams({ limit: "500" })).toMatchObject({ limit: 100 })
  })

  it("clamps a negative limit up to 1", () => {
    expect(getPaginationParams({ limit: "-5" })).toMatchObject({ limit: 1 })
  })

  it("treats limit 0 as falsy and falls back to the default of 10", () => {
    expect(getPaginationParams({ limit: "0" })).toMatchObject({ limit: 10 })
  })

  it("computes skip from page and limit", () => {
    expect(getPaginationParams({ page: "3", limit: "20" })).toEqual({
      page: 3,
      limit: 20,
      skip: 40,
    })
  })
})

describe("buildPaginationMeta", () => {
  it("computes totalPages and hasNext/hasPrevious", () => {
    expect(
      buildPaginationMeta({ page: 2, limit: 10, totalItems: 25 }),
    ).toEqual({
      page: 2,
      limit: 10,
      totalItems: 25,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    })
  })

  it("hasPreviousPage is false on page 1", () => {
    expect(
      buildPaginationMeta({ page: 1, limit: 10, totalItems: 25 }).hasPreviousPage,
    ).toBe(false)
  })

  it("hasNextPage is false on the last page", () => {
    expect(
      buildPaginationMeta({ page: 3, limit: 10, totalItems: 25 }).hasNextPage,
    ).toBe(false)
  })
})
