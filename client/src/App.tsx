import { Route, Routes } from "react-router-dom"
import { Navbar } from "./components/layout/NavBar"
import { ShopPage } from "./pages/ShopPage"
import { ProductDetailPage } from "./pages/ProductDetailPage"
import { CartPage } from "./pages/CartPage"

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<ShopPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </>
  )
}

export default App
