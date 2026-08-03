// src/app.ts
import express from "express"
import cors from "cors"
import pinoHttp from "pino-http"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { prisma } from "./lib/prisma"
import { logger } from "./lib/logger"
import { register } from "./lib/metrics"
import { metricsMiddleware } from "./middlewares/metrics.middleware"
import categoryRoutes from "./routes/category.routes"
import productRoutes from "./routes/product.routes"
import productImageRoutes from "./routes/product-image.routes"
import authRoutes from "./routes/auth.routes"
import cartRoutes from "./routes/cart.routes"
import wishlistRoutes from "./routes/wishlist.routes"
import orderRoutes from "./routes/order.routes"
import adminOrderRoutes from "./routes/admin-order.routes"
import adminProductRoutes from "./routes/admin-product.routes"
import uploadRoutes from "./routes/upload.routes"
import { errorMiddleware } from "./middlewares/error.middleware"

const app = express()

const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(helmet())
app.use(
  pinoHttp({
    logger,
    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 500) return "error"
      if (res.statusCode >= 400) return "warn"
      return "info"
    },
  }),
)
app.use(metricsMiddleware)

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : "http://localhost:5173",
    credentials: true,
  }),
)

app.use(express.json())
app.use(cookieParser())

app.get("/", (_req, res) => {
  res.json({ message: "API is running" })
})

app.get("/health/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ ok: true, message: "Database connected" })
  } catch (error) {
    req.log.error({ err: error }, "Database health check failed")
    res.status(500).json({ ok: false, message: "Database connection failed" })
  }
})

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType)
  res.end(await register.metrics())
})

app.use("/api/categories", categoryRoutes)
app.use("/api/products", productRoutes)
app.use("/api/uploads", uploadRoutes)
app.use("/api", productImageRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/wishlist", wishlistRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/admin/orders", adminOrderRoutes)
app.use("/api/admin/products", adminProductRoutes)

app.use(errorMiddleware)

export default app
