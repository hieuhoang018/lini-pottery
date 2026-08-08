import { Route, Routes } from "react-router-dom"
import { Navbar } from "./components/layout/NavBar"
import { ShopPage } from "./pages/ShopPage"
import { ProductDetailPage } from "./pages/ProductDetailPage"
import { CartPage } from "./pages/CartPage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { CheckoutPage } from "./pages/CheckoutPage"
import { WishlistPage } from "./pages/WishlistPage"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { MyOrdersPage } from "./pages/MyOrdersPage"
import { OrderSuccessPage } from "./pages/OrderSuccessPage"
import { OrderDetailPage } from "./pages/OrderDetailPage"
import { AccountSettingsPage } from "./pages/AccountSettingsPage"
import { VerifyEmailChangePage } from "./pages/VerifyEmailChangePage"
import { Footer } from "./components/layout/Footer"
import HomePage from "./pages/HomePage"

function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-50 px-6 py-10 text-stone-900">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/verify-email"
            element={<VerifyEmailChangePage />}
          />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
