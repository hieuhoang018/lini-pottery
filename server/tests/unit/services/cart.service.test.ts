import { beforeEach, describe, expect, it, vi } from "vitest"

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    cart: { findUnique: vi.fn(), create: vi.fn() },
    product: { findUnique: vi.fn() },
    cartItem: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}))

vi.mock("../../../src/lib/prisma", () => ({ prisma: prismaMock }))

import {
  addItemToCart,
  updateCartItemQuantity,
} from "../../../src/services/cart.service"

const activeCart = { id: "cart1", userId: "user1" }

beforeEach(() => {
  vi.clearAllMocks()
  prismaMock.cart.findUnique.mockResolvedValue({ ...activeCart, items: [] })
})

describe("addItemToCart", () => {
  it("rejects when the product is inactive", async () => {
    prismaMock.product.findUnique.mockResolvedValue({
      id: "p1",
      isActive: false,
      stockQuantity: 10,
    })

    await expect(addItemToCart("user1", "p1", 1)).rejects.toThrow(
      "PRODUCT_NOT_AVAILABLE",
    )
  })

  it("rejects when requested quantity exceeds stock", async () => {
    prismaMock.product.findUnique.mockResolvedValue({
      id: "p1",
      isActive: true,
      stockQuantity: 2,
    })
    prismaMock.cartItem.findUnique.mockResolvedValue(null)

    await expect(addItemToCart("user1", "p1", 3)).rejects.toThrow(
      "NOT_ENOUGH_STOCK",
    )
  })

  it("merges quantity into an existing cart item when stock allows", async () => {
    prismaMock.product.findUnique.mockResolvedValue({
      id: "p1",
      isActive: true,
      stockQuantity: 10,
    })
    prismaMock.cartItem.findUnique.mockResolvedValue({
      id: "item1",
      quantity: 2,
    })
    prismaMock.cartItem.update.mockResolvedValue({ id: "item1", quantity: 5 })

    await addItemToCart("user1", "p1", 3)

    expect(prismaMock.cartItem.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "item1" },
        data: { quantity: 5 },
      }),
    )
    expect(prismaMock.cartItem.create).not.toHaveBeenCalled()
  })

  it("rejects merging when the combined quantity would exceed stock", async () => {
    prismaMock.product.findUnique.mockResolvedValue({
      id: "p1",
      isActive: true,
      stockQuantity: 4,
    })
    prismaMock.cartItem.findUnique.mockResolvedValue({
      id: "item1",
      quantity: 2,
    })

    await expect(addItemToCart("user1", "p1", 3)).rejects.toThrow(
      "NOT_ENOUGH_STOCK",
    )
    expect(prismaMock.cartItem.update).not.toHaveBeenCalled()
  })
})

describe("updateCartItemQuantity", () => {
  it("rejects when the cart item does not belong to the user", async () => {
    prismaMock.cartItem.findUnique.mockResolvedValue({
      id: "item1",
      cart: { userId: "someone-else" },
      product: { stockQuantity: 10 },
    })

    await expect(
      updateCartItemQuantity("item1", "user1", 2),
    ).rejects.toThrow("CART_ITEM_NOT_FOUND")
  })

  it("deletes the item when quantity is set to 0 or below", async () => {
    prismaMock.cartItem.findUnique.mockResolvedValue({
      id: "item1",
      cart: { userId: "user1" },
      product: { stockQuantity: 10 },
    })

    await updateCartItemQuantity("item1", "user1", 0)

    expect(prismaMock.cartItem.delete).toHaveBeenCalledWith({
      where: { id: "item1" },
    })
    expect(prismaMock.cartItem.update).not.toHaveBeenCalled()
  })

  it("rejects when the new quantity exceeds stock", async () => {
    prismaMock.cartItem.findUnique.mockResolvedValue({
      id: "item1",
      cart: { userId: "user1" },
      product: { stockQuantity: 2 },
    })

    await expect(
      updateCartItemQuantity("item1", "user1", 5),
    ).rejects.toThrow("NOT_ENOUGH_STOCK")
  })
})
