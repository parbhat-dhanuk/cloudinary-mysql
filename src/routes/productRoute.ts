
import express, {Router} from "express"
import AuthMiddleware, { Role } from "../middleware/middleware"
// import {multer,storage} from "../middleware/multerMiddleware"
import { uploadImage } from "../middleware/multerMiddleware"
import ProductController from "../controllers/productController"

const router:Router=express.Router()

// const upload = multer({storage:storage})
router.route("/").post(AuthMiddleware.isAuthenticated,AuthMiddleware.restrictTo(Role.Admin),
uploadImage,ProductController.addProduct).get(ProductController.getAllProducts)


router.route("/:id").get(ProductController.getSingleProduct).delete(AuthMiddleware.isAuthenticated,AuthMiddleware.restrictTo(Role.Admin),ProductController.deleteProduct)
.patch(AuthMiddleware.isAuthenticated,AuthMiddleware.restrictTo(Role.Admin),uploadImage,ProductController.updatePrduct)


export default router