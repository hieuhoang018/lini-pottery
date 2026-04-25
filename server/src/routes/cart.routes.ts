import { Router } from "express"
import {
  addCartItemHandler,
  clearCartHandler,
  getCartHandler,
  removeCartItemHandler,
  updateCartItemHandler,
} from "../controllers/cart.controller"
import { requireAuth } from "../middlewares/auth.middleware"

const router = Router()

router.use(requireAuth)

router.get("/", getCartHandler)
router.post("/items", addCartItemHandler)
router.patch("/items/:itemId", updateCartItemHandler)
router.delete("/items/:itemId", removeCartItemHandler)
router.delete("/", clearCartHandler)

export default router
