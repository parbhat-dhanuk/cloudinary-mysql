
import {Request,Response,NextFunction} from "express"
import jwt from "jsonwebtoken"
import User from "../database/models/userModel"


export interface AuthRequest extends Request{  //yo chai hami le foreign key ko value ko lagi export gareko.
    user?:{
        username:string,
        email:string,
        password:string,
        role:string,
        id:string
    }
}

export enum Role{

    Admin = "admin",
    Customer = "customer"

}

class AuthMiddleware{

   async isAuthenticated(req:AuthRequest,res:Response,next:NextFunction):Promise<void>{
      //get token from user
       
      const token = req.headers.authorization
      if(!token||token===undefined){
        res.status(403).json({
            message:"token not provided"
        })
        return
      }
      //verify token if it is legit or tempared
      jwt.verify(token,process.env.SECRET_KEY as string, async(err,decoded:any)=>{   //(token,yo chai env bata jwt baneko password,cb)
       if(err){
        res.status(403).json({
            message:"invalid token"
        })

       }else{
         //check if decoded object id user exist or not
      try {
        const userData = await User.findByPk(decoded.id)
        if(!userData){
           res.status(404).json({
               message:"no user with that token"
           })
           return
        }
        req.user = userData
        next()

      } catch (error) {
        res.status(500).json({
            message:"something went wrong"
        })
      }
       }

      })

      
    }

    restrictTo(...roles:Role[]){
        return(req:AuthRequest,res:Response,next:NextFunction)=>{  // middleware return gariraxa.
          let userRole=req.user?.role as Role
          if(!roles.includes(userRole)){
            res.status(403).json({
                message:"you don't have permission"
            })
          }else{
            next()
          }
        }
    }

}

// isAuththenticated --> restrictTo("admin")-->addProduct

export default new AuthMiddleware()