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
import type { CartContextType, CartDisplayItem } from "../types/cart"

const CartContext = createContext<CartContextType | null>(null)

const GUEST_CART_KEY = "guest_cart"

function getGuestCartFromStorage(): CartDisplayItem[] {
  const raw = localStorage.getItem(GUEST_CART_KEY)
  if (!raw) return []

  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveGuestCart(items: CartDisplayItem[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()

  const [items, setItems] = useState<CartDisplayItem[]>([])
  const [loading, setLoading] = useState(true)

  const isLoggedIn = Boolean(user)

  const loadCart = async () => {
    if (authLoading) {
      setLoading(true)
      return
    }

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
      toast.error("Xin hãy đợi một lúc rồi thử lại")
      return
    }

    try {
      if (isLoggedIn) {
        await addCartItem(product.id, quantity)
        await loadCart()
        toast.success("Đã thêm vào giỏ hàng")
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
      toast.success("Đã thêm vào giỏ hàng")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể thêm vào giỏ hàng")
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (authLoading) {
      toast.error("Xin hãy đợi một lúc rồi thử lại")
      return
    }

    try {
      if (quantity <= 0) {
        await removeFromCart(productId)
        return
      }

      if (isLoggedIn) {
        const cart = await getCart()
        const cartItem = cart.items.find((item) => item.productId === productId)

        if (!cartItem) {
          toast.error("Không tìm thấy sản phẩm")
          return
        }

        await updateCartItem(cartItem.id, quantity)
        await loadCart()
        toast.success("Đã cập nhật giỏ hàng")
        return
      }

      const updatedItems = getGuestCartFromStorage().map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      )

      saveGuestCart(updatedItems)
      setItems(updatedItems)
      toast.success("Đã cập nhật giỏ hàng")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể cập nhật giỏ hàng")
    }
  }

  const removeFromCart = async (productId: string) => {
    if (authLoading) {
      toast.error("Xin hãy đợi một lúc rồi thử lại")
      return
    }

    try {
      if (isLoggedIn) {
        const cart = await getCart()
        const cartItem = cart.items.find((item) => item.productId === productId)

        if (!cartItem) {
          toast.error("Không tìm thấy sản phẩm")
          return
        }

        await removeCartItem(cartItem.id)
        await loadCart()
        toast.success("Đã xóa sản phẩm")
        return
      }

      const updatedItems = getGuestCartFromStorage().filter(
        (item) => item.product.id !== productId,
      )

      saveGuestCart(updatedItems)
      setItems(updatedItems)
      toast.success("Đã xóa sản phẩm")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể xóa sản phẩm")
    }
  }

  const clearCart = async () => {
    if (authLoading) {
      toast.error("Xin hãy đợi một lúc rồi thử lại")
      return
    }

    try {
      if (isLoggedIn) {
        await clearServerCart()
        await loadCart()
        toast.success("Đã xóa giỏ hàng")
        return
      }

      localStorage.removeItem(GUEST_CART_KEY)
      setItems([])
      toast.success("Đã xóa giỏ hàng")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể xóa giỏ hàng")
    }
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
