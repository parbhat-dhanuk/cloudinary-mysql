import express, { Router } from "express"
const router:Router = express.Router()
import AuthMiddleware from "../middleware/middleware"
import cartController from "../controllers/cartController"

router.route("/").post(AuthMiddleware.isAuthenticated,cartController.addToCart)
.get(AuthMiddleware.isAuthenticated,cartController.getMyCarts)

router.route("/:id").patch(AuthMiddleware.isAuthenticated,cartController.updateCartItem)
.delete(AuthMiddleware.isAuthenticated,cartController.deleteMyCartItems)

export default router