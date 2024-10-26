import express, {Router}  from "express";
import AuthMiddleware, { Role } from "../middleware/middleware"
import categoryController from "../controllers/categoryController";
const router:Router = express.Router()

router.route("/category").post(AuthMiddleware.isAuthenticated,AuthMiddleware.restrictTo(Role.Admin),categoryController.addCategory)
.get(categoryController.getCategory)

router.route("/category/:id").delete(AuthMiddleware.isAuthenticated,AuthMiddleware.restrictTo(Role.Admin),categoryController.deleteCategory)
.patch(AuthMiddleware.isAuthenticated,AuthMiddleware.restrictTo(Role.Admin),categoryController.updateCategory)


export default router