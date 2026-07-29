import { beforeEach, describe, expect, it, vi } from "vitest"
import { act, renderHook, waitFor } from "@testing-library/react"
import { CartProvider, useCart } from "./CartContext"
import type { Product } from "../types/product"

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

vi.mock("./AuthContext", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}))

vi.mock("../api/cartApi", () => ({
  getCart: vi.fn(),
  addCartItem: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
  clearCart: vi.fn(),
}))

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: "p1",
  name: "Ceramic Vase",
  slug: "ceramic-vase",
  description: "A handmade vase",
  price: "100",
  stockQuantity: 10,
  isActive: true,
  categoryId: "c1",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  category: {
    id: "c1",
    name: "Vases",
    slug: "vases",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  images: [],
  ...overrides,
})

beforeEach(() => {
  localStorage.clear()
})

describe("CartContext (guest cart)", () => {
  it("starts empty", async () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.items).toEqual([])
    expect(result.current.total).toBe(0)
  })

  it("adds a product to the guest cart and computes the total", async () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    await waitFor(() => expect(result.current.loading).toBe(false))

    const product = makeProduct({ price: "150" })

    await act(async () => {
      await result.current.addToCart(product, 2)
    })

    expect(result.current.items).toEqual([{ product, quantity: 2 }])
    expect(result.current.total).toBe(300)
  })

  it("merges quantity when adding the same product again", async () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    await waitFor(() => expect(result.current.loading).toBe(false))

    const product = makeProduct()

    await act(async () => {
      await result.current.addToCart(product, 1)
    })
    await act(async () => {
      await result.current.addToCart(product, 2)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(3)
  })

  it("updates the quantity of an existing item", async () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    await waitFor(() => expect(result.current.loading).toBe(false))

    const product = makeProduct()

    await act(async () => {
      await result.current.addToCart(product, 1)
    })
    await act(async () => {
      await result.current.updateQuantity(product.id, 5)
    })

    expect(result.current.items[0].quantity).toBe(5)
  })

  it("removes the item entirely when quantity is updated to 0", async () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    await waitFor(() => expect(result.current.loading).toBe(false))

    const product = makeProduct()

    await act(async () => {
      await result.current.addToCart(product, 1)
    })
    await act(async () => {
      await result.current.updateQuantity(product.id, 0)
    })

    expect(result.current.items).toEqual([])
  })

  it("removes an item via removeFromCart", async () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    await waitFor(() => expect(result.current.loading).toBe(false))

    const product = makeProduct()

    await act(async () => {
      await result.current.addToCart(product, 1)
    })
    await act(async () => {
      await result.current.removeFromCart(product.id)
    })

    expect(result.current.items).toEqual([])
  })

  it("clears the whole cart", async () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.addToCart(makeProduct({ id: "p1" }), 1)
    })
    await act(async () => {
      await result.current.addToCart(makeProduct({ id: "p2" }), 1)
    })
    await act(async () => {
      await result.current.clearCart()
    })

    expect(result.current.items).toEqual([])
    expect(localStorage.getItem("guest_cart")).toBeNull()
  })
})
