
import { Request,Response } from "express";
import User from "../database/models/userModel";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"




class AuthController{

        //Register
   async registerUser(req:Request,res:Response):Promise<void>{     //async method(function)ho 
                                                  // async method vayepaxi hami le return type Promise<void> nai hunxa.
        const {username,email,password,role}=req.body
        if(!username||!email||!password){
            res.status(400).json({
                message:"please provide username,email,password"
            })
            return
        }
         
          //Email validation
     const databaseEmail =  await User.findOne({
        where:{
          email:email
        }
     })
    if(databaseEmail){
      res.status(400).json({
        meaasge:"email is already in use"
      }) 
      return
    }

     await User.create({
        username,  //key valur pair same xa vanepaxi {username,password,email} lekda ni hunxa.
        email,
        password : bcrypt.hashSync(password,8),   //(k kura hash garne, saltValue) //Normally salt value 8,10,12 samma rakne.
        role:role
      })
      res.status(200).json({
        message:"user registered successfully"
      })


    }





    //Login
 async loginUser(req:Request,res:Response):Promise<void>{

  const {email,password} =req.body

  if(!email || !password){
   res.status(400).json({
    message:"please provide email and password"
   })
   return
  }
  
  // check whether user with above email exist or not
  const [data] = await User.findAll({
    where: {
       email : email
    }
  })
 

  if(!data){
    res.status(404).json({
      message:"no user with that email"
    })
    return
  }
  
  //Check password
  const isMatched = bcrypt.compareSync(password,data.password) //(bodybata aako password , db ma already store vako password jo [data] ma store xa)
                                                              // isMatched ma boolean data store xa.
  if(!isMatched){
    res.status(403).json({
      message:"Invalid email or password"
    })
    return
  }

//generate token and send to user
const token = jwt.sign({id:data.id},process.env.SECRET_KEY as string,{     // parbhat vaneko yo encryption lai descryption garne passord ho.
  expiresIn:"20d"
})
res.status(200).json({
  message:"login successfully",
  data:token
})

}

}

// const AuthControllers = new AuthController      //yo chai instance tarika le export gareko
// export default AuthControllers                   instatic instance garne maan chaina 
                                                 //vane mathi register method ma public satic aagdhi lekdine.
export default new AuthController()