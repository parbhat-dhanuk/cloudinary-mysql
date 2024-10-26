import User from "../database/models/userModel"
import bcrypt from "bcrypt"

const adminSeeder = async():Promise<void>=>{
   const [data] = await User.findAll({
        where:{
            email:"admin@gmail.com"
        }
    })
   
    if(!data){   //mathi data destructure nagareko vaye data.length>0 lekher condition lagaunu parthoe.
      
        await User.create({
            email:"admin@gmail.com",
            password: bcrypt.hashSync("admin123",8),
            username:"admin",
            role:"admin"
        })
        console.log("admin credentials seeded successfully")
    }else{
        console.log("admin credentials already seeded")
    }
}

export default adminSeeder