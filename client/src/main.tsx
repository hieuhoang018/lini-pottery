import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import App from "./App"
import "./index.css"
import { AuthProvider } from "./contexts/AuthContext"
import { CartProvider } from "./contexts/CartContext"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />

          <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
