import Category from "../database/models/category"
import { Request,Response } from "express"


class CategoryController{
    
    //Category Seeder//

    categoryData=[
        {
            categoryName:"Electronics"
        },

        {
            categoryName:"Groceries"
        },
        
        {
            categoryName:"Food/Beverages"
        }
    ]



   async seedCategory():Promise<void>{
    const datas = await Category.findAll()

    if(datas.length===0){
     await  Category.bulkCreate(this.categoryData)
     console.log("category seeded successfully")
    }else{
        console.log("category already seeded")
    }
}

//CREATE

async addCategory(req:Request,res:Response):Promise<void>{
    const {categoryName} = req.body
    if(!categoryName){
        res.status(404).json({message:"please provide category name"})
        return
    }
    await Category.create({
        categoryName
    })
    res.status(200).json({
        message:"category added successfully"
    })
}
  //Get category

async getCategory(req:Request,res:Response):Promise<void>{
    const data = await Category.findAll()
    res.status(200).json({
        message:"category fetched",
        data:data
    })
}

//Delete category

async deleteCategory(req:Request,res:Response):Promise<void>{
    const id =req.params.id
    const data = await Category.findAll({
        where:{
            id:id
        }
    })

    if(data.length===0){
        res.status(404).json({
            message:"no category with that id"
        })
    }else{
        await Category.destroy({
            where:{
                id:id
            }
        })
        res.status(200).json({
            message:"category deleted successfully"
        })
    }
}

 // Update category 
 async updateCategory(req:Request,res:Response):Promise<void>{
    const id = req.params.id
    const categoryName = req.body.categoryName
    await Category.update({categoryName},{
        where:{
            id:id
        }
    })
    res.status(200).json({
        message:"category updated"
    })
 }

}

export default new CategoryController()