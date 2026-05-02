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
import { AdminRoute } from "./components/auth/AdminRoute"
import { AdminLayout } from "./components/admin/AdminLayout"
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage"
import { AdminProductsPage } from "./pages/admin/AdminProductsPage"
import { AdminProductDetailPage } from "./pages/admin/AdminProductDetailPage"
import { AdminCreateProductPage } from "./pages/admin/AdminCreateProductPage"
import { AdminOrderDetailPage } from "./pages/admin/AdminOrderDetailPage"

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<ShopPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AdminCreateProductPage />} />
          <Route path="products/:id" element={<AdminProductDetailPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
