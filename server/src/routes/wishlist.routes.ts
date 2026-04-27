import { Router } from "express"
import {
  addWishlistItemHandler,
  getWishlistHandler,
  removeWishlistItemHandler,
} from "../controllers/wishlist.controller"
import { requireAuth } from "../middlewares/auth.middleware"

const router = Router()

router.use(requireAuth)

router.get("/", getWishlistHandler)
router.post("/items", addWishlistItemHandler)
router.delete("/items/:productId", removeWishlistItemHandler)

export default router
