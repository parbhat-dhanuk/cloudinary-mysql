
import express,{Router} from "express"
import AuthController from "../controllers/userController"
import errorHandler from "../services/catchAsyncError"


const router:Router=express.Router()

//Register
router.route("/register").post(errorHandler(AuthController.registerUser)) //errorHandler chai hami le try catch 
                                                                          // xuttai function banayera haleko ho .         
//Login
router.route("/login").post(AuthController.loginUser)


export default router