import { Route, Routes } from "react-router-dom"
import { ShopPage } from "./pages/ShopPage"
import { ProductDetailPage } from "./pages/ProductDetailPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<ShopPage />} />
      <Route path="/products/:slug" element={<ProductDetailPage />} />
    </Routes>
  )
}

export default App
