import { Router } from "express"
import {
  createProductHandler,
  getProductBySlugHandler,
  getProductsHandler,
} from "../controllers/product.controller"

const router = Router()

router.get("/", getProductsHandler)
router.get("/:slug", getProductBySlugHandler)
router.post("/", createProductHandler)

export default router
