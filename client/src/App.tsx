import { useEffect, useState } from "react"
import { getProducts } from "./api/productApi"
import type { Product } from "./types/product"

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => {
        setError(err.response?.data?.message || err.message)
      })
  }, [])

  return (
    <main style={{ padding: "24px" }}>
      <h1>Pottery Shop</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {products.map((product) => (
        <div key={product.id} style={{ marginBottom: "16px" }}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>€{product.price}</p>
          <p>Stock: {product.stockQuantity}</p>
        </div>
      ))}
    </main>
  )
}

export default App
