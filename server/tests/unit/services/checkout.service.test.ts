import { beforeEach, describe, expect, it, vi } from "vitest"

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    $transaction: vi.fn(),
  },
}))

vi.mock("../../../src/lib/prisma", () => ({ prisma: prismaMock }))

import { checkoutFromCart, guestCheckout } from "../../../src/services/checkout.service"

const activeProduct = (overrides = {}) => ({
  id: "p1",
  name: "Vase",
  price: 100,
  isActive: true,
  stockQuantity: 10,
  featuredImageUrl: null,
  images: [],
  ...overrides,
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe("checkoutFromCart", () => {
  const runWithTx = (tx: any) => {
    prismaMock.$transaction.mockImplementation(async (cb: any) => cb(tx))
  }

  it("rejects when the cart is empty", async () => {
    runWithTx({ cart: { findUnique: vi.fn().mockResolvedValue({ items: [] }) } })

    await expect(
      checkoutFromCart({ userId: "u1" } as any),
    ).rejects.toThrow("CART_EMPTY")
  })

  it("rejects when the cart is missing", async () => {
    runWithTx({ cart: { findUnique: vi.fn().mockResolvedValue(null) } })

    await expect(
      checkoutFromCart({ userId: "u1" } as any),
    ).rejects.toThrow("CART_EMPTY")
  })

  it("rejects when a cart item's product is inactive", async () => {
    runWithTx({
      cart: {
        findUnique: vi.fn().mockResolvedValue({
          id: "cart1",
          items: [
            { productId: "p1", quantity: 1, product: activeProduct({ isActive: false }) },
          ],
        }),
      },
    })

    await expect(
      checkoutFromCart({ userId: "u1" } as any),
    ).rejects.toThrow("PRODUCT_NOT_AVAILABLE")
  })

  it("rejects when a cart item's quantity exceeds stock", async () => {
    runWithTx({
      cart: {
        findUnique: vi.fn().mockResolvedValue({
          id: "cart1",
          items: [
            { productId: "p1", quantity: 5, product: activeProduct({ stockQuantity: 2 }) },
          ],
        }),
      },
    })

    await expect(
      checkoutFromCart({ userId: "u1" } as any),
    ).rejects.toThrow("NOT_ENOUGH_STOCK")
  })
})

describe("guestCheckout", () => {
  const runWithTx = (tx: any) => {
    prismaMock.$transaction.mockImplementation(async (cb: any) => cb(tx))
  }

  it("rejects when no items are provided", async () => {
    runWithTx({})

    await expect(
      guestCheckout({ items: [] } as any),
    ).rejects.toThrow("CART_EMPTY")
  })

  it("rejects when a requested product cannot be found", async () => {
    runWithTx({ product: { findMany: vi.fn().mockResolvedValue([]) } })

    await expect(
      guestCheckout({ items: [{ productId: "p1", quantity: 1 }] } as any),
    ).rejects.toThrow("PRODUCT_NOT_AVAILABLE")
  })

  it("rejects a non-positive or non-integer quantity", async () => {
    runWithTx({
      product: { findMany: vi.fn().mockResolvedValue([activeProduct()]) },
    })

    await expect(
      guestCheckout({ items: [{ productId: "p1", quantity: 0 }] } as any),
    ).rejects.toThrow("INVALID_QUANTITY")
  })

  it("rejects when quantity exceeds stock", async () => {
    runWithTx({
      product: {
        findMany: vi.fn().mockResolvedValue([activeProduct({ stockQuantity: 1 })]),
      },
    })

    await expect(
      guestCheckout({ items: [{ productId: "p1", quantity: 5 }] } as any),
    ).rejects.toThrow("NOT_ENOUGH_STOCK")
  })
})
