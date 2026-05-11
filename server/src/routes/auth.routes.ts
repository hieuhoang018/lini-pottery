import { Router } from "express"
import {
  loginHandler,
  logoutHandler,
  meHandler,
  refreshHandler,
  registerHandler,
} from "../controllers/auth.controller"
import { requireAuth } from "../middlewares/auth.middleware"

const router = Router()

router.post("/register", registerHandler)
router.post("/login", loginHandler)
router.post("/refresh", refreshHandler)
router.post("/logout", logoutHandler)
router.get("/me", requireAuth, meHandler)

export default router
