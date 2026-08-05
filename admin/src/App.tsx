import { Route, Routes } from "react-router-dom"
import { AdminRoute } from "./components/auth/AdminRoute"
import { AdminLayout } from "./components/layout/AdminLayout"
import { LoginPage } from "./pages/LoginPage"
import { DashboardPage } from "./pages/DashboardPage"
import { AdminOrdersPage } from "./pages/AdminOrdersPage"
import { AdminOrderDetailPage } from "./pages/AdminOrderDetailPage"
import { AdminProductsPage } from "./pages/AdminProductsPage"
import { AdminCreateProductPage } from "./pages/AdminCreateProductPage"
import { AdminProductDetailPage } from "./pages/AdminProductDetailPage"
import { AdminCategoriesPage } from "./pages/AdminCategoriesPage"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminCreateProductPage />} />
        <Route path="products/:id" element={<AdminProductDetailPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
      </Route>
    </Routes>
  )
}

export default App
