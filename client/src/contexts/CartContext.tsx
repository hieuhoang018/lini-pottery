import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import toast from "react-hot-toast"
import {
  addCartItem,
  clearCart as clearServerCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../api/cartApi"
import { useAuth } from "./AuthContext"
import type { Product } from "../types/product"

type CartItem = {
  product: Product
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  loading: boolean
  total: number
  addToCart: (product: Product, quantity?: number) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

const GUEST_CART_KEY = "guest_cart"

function getGuestCartFromStorage(): CartItem[] {
  const raw = localStorage.getItem(GUEST_CART_KEY)
  if (!raw) return []

  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveGuestCart(items: CartItem[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()

  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  const isLoggedIn = Boolean(user)

  const loadCart = async () => {
    if (authLoading) return

    try {
      setLoading(true)

      if (isLoggedIn) {
        const cart = await getCart()

        setItems(
          cart.items.map((item) => ({
            product: item.product,
            quantity: item.quantity,
          })),
        )

        return
      }

      setItems(getGuestCartFromStorage())
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load cart")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCart()
  }, [authLoading, user])

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity
    }, 0)
  }, [items])

  const addToCart = async (product: Product, quantity = 1) => {
    if (authLoading) {
      toast.error("Please wait a moment and try again")
      return
    }

    if (isLoggedIn) {
      await addCartItem(product.id, quantity)
      await loadCart()
      toast.success("Product added to cart")
      return
    }

    const currentItems = getGuestCartFromStorage()
    const existingItem = currentItems.find(
      (item) => item.product.id === product.id,
    )

    const updatedItems = existingItem
      ? currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      : [...currentItems, { product, quantity }]

    saveGuestCart(updatedItems)
    setItems(updatedItems)
    toast.success("Product added to cart")
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (authLoading) {
      toast.error("Please wait a moment and try again")
      return
    }

    if (quantity <= 0) {
      await removeFromCart(productId)
      return
    }

    if (isLoggedIn) {
      const cart = await getCart()
      const cartItem = cart.items.find((item) => item.productId === productId)

      if (!cartItem) {
        toast.error("Cart item not found")
        return
      }

      await updateCartItem(cartItem.id, quantity)
      await loadCart()
      toast.success("Cart updated")
      return
    }

    const updatedItems = getGuestCartFromStorage().map((item) =>
      item.product.id === productId ? { ...item, quantity } : item,
    )

    saveGuestCart(updatedItems)
    setItems(updatedItems)
    toast.success("Cart updated")
  }

  const removeFromCart = async (productId: string) => {
    if (authLoading) {
      toast.error("Please wait a moment and try again")
      return
    }

    if (isLoggedIn) {
      const cart = await getCart()
      const cartItem = cart.items.find((item) => item.productId === productId)

      if (!cartItem) {
        toast.error("Cart item not found")
        return
      }

      await removeCartItem(cartItem.id)
      await loadCart()
      toast.success("Item removed")
      return
    }

    const updatedItems = getGuestCartFromStorage().filter(
      (item) => item.product.id !== productId,
    )

    saveGuestCart(updatedItems)
    setItems(updatedItems)
    toast.success("Item removed")
  }

  const clearCart = async () => {
    if (authLoading) {
      toast.error("Please wait a moment and try again")
      return
    }

    if (isLoggedIn) {
      await clearServerCart()
      await loadCart()
      toast.success("Cart cleared")
      return
    }

    localStorage.removeItem(GUEST_CART_KEY)
    setItems([])
    toast.success("Cart cleared")
  }

  return (
    <CartContext.Provider
      value={{
        items,
        loading: loading || authLoading,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used inside CartProvider")
  }

  return context
}
