import express from "express"
import cors from "cors"
import { prisma } from "./lib/prisma"
import categoryRoutes from "./routes/category.routes"
import productRoutes from "./routes/product.routes"
import productImageRoutes from "./routes/product-image.routes"
import authRoutes from "./routes/auth.routes"
import cartRoutes from "./routes/cart.routes"
import wishlistRoutes from "./routes/wishlist.routes"
import orderRoutes from "./routes/order.routes"
import adminOrderRoutes from "./routes/admin-order.routes"
import { errorMiddleware } from "./middlewares/error.middleware"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (_req, res) => {
  res.json({ message: "API is running" })
})

app.get("/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ ok: true, message: "Database connected" })
  } catch (error) {
    console.error("Database health check failed:", error)
    res.status(500).json({ ok: false, message: "Database connection failed" })
  }
})

app.use("/api/categories", categoryRoutes)
app.use("/api/products", productRoutes)
app.use("/api", productImageRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/wishlist", wishlistRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/admin/orders", adminOrderRoutes)

app.use(errorMiddleware)

export default app
