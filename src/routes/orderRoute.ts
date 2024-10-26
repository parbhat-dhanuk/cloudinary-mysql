

import express,{Router} from "express"
import AuthMiddleware, { Role } from "../middleware/middleware"
import errorHandler from "../services/catchAsyncError"
import orderController from "../controllers/orderController"

const router:Router=express.Router()

router.route("/").post(AuthMiddleware.isAuthenticated,errorHandler(orderController.createOrder))

router.route("/verify").post(AuthMiddleware.isAuthenticated,errorHandler(orderController.verifyTransaction))

router.route("/customer").get(AuthMiddleware.isAuthenticated,errorHandler(orderController.fetchMyOrders))

router.route("/customer/:id").patch(AuthMiddleware.isAuthenticated,AuthMiddleware.restrictTo(Role.Customer),
errorHandler(orderController.cancelOrder)).get(AuthMiddleware.isAuthenticated,errorHandler(orderController.fetchOrderDetails))



router.route("/admin/payment/:id").patch(AuthMiddleware.isAuthenticated,AuthMiddleware.restrictTo(Role.Admin),
errorHandler(orderController.changePaymentStatus))

router.route("/admin/:id").patch(AuthMiddleware.isAuthenticated,AuthMiddleware.restrictTo(Role.Admin),errorHandler(orderController.changeOrderStatus))
.delete(AuthMiddleware.isAuthenticated,AuthMiddleware.restrictTo(Role.Admin),errorHandler(orderController.deleteOrder))




export default router