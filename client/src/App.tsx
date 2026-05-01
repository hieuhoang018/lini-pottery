import { Route, Routes } from "react-router-dom"
import { Navbar } from "./components/layout/NavBar"
import { ShopPage } from "./pages/ShopPage"
import { ProductDetailPage } from "./pages/ProductDetailPage"
import { CartPage } from "./pages/CartPage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { CheckoutPage } from "./pages/CheckoutPage"

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
      </Routes>
    </>
  )
}

export default App
