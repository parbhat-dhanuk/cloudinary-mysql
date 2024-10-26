
import {Request,Response} from "express"
import Product from "../database/models/productModel"
import { AuthRequest } from "../middleware/middleware"
import User from "../database/models/userModel"
import Category from "../database/models/category"
import fs from 'fs'
import path from "path"
import { cloudinary } from "../middleware/multerMiddleware"






class ProductController{


  
    async addProduct(req:AuthRequest,res:Response):Promise<void>{
   
   try {
      const userId=req.user?.id 
      const {productName,productDescription,productPrice,productTotalStockQty,categoryId}=req.body
      const file = req.file;
      if (!file) throw new Error('Image is required');

       // Upload image to Cloudinary
       const uploadResult = await cloudinary.uploader.upload(file.path,{
         folder:'Mern'
       });
       if(!productName||!productDescription||!productPrice||!productTotalStockQty||!categoryId){
         res.status(400).json({
             message:"please provide ProductName,productDescription,productPrice,productTotalStockQty,categoryId"
         })
      }

       const response =  Product.create({
            productName,
            productPrice,
            productDescription,
            productTotalStockQty,
            productImageUrl:uploadResult.secure_url,
            userId:userId,
            categoryId:categoryId,
            imagePublicId:uploadResult.public_id // Save public_id here
         })
         res.status(200).json({
          message:"product added successfully",
          data:response
         })


   } catch (error:any) {
      res.status(400).json({ message: error.message });
   }

    }

    //Get All Products

    async getAllProducts(req:Request,res:Response):Promise<void>{
      const data = await Product.findAll(
         {                        //yo chai find gareko data ko sanga relation ma xa tesko(foreign key) data ni dinxa.
            include: [              //yedi relation na vako vate yo kura garna mildaina.      
               {
                  model:User,
                  attributes:["id","email","username"] //attributes ma chai k kura matar dine vanne kura ho.
               },

               {
                  model:Category,
                  attributes:["id", "categoryName"]
               }
            ]
         }
      )
      res.status(200).json({
         message:"Product fetched successfully",
         data:data
      })
    }
    

    //Get Single Product

    async getSingleProduct(req:Request,res:Response):Promise<void>{
      const id = req.params.id
      const data = await Product.findAll({
         where:{
            id:id
         },
         include:[
            {
               model:User,
               attributes:["id","email","username"]
            },
            {
               model:Category,
               attributes:["id","categoryName"]
            }
         ]
      })
      if(data.length===0){
         res.status(404).json({
            message:"no product with that id"
         })
      }else{
         res.status(200).json({
            message:"product fetched successfully",
            data:data
         })
      }
    }

    //Delete product

    async deleteProduct(req:Request,res:Response):Promise<void>{
  
      try {

       const id = req.params.id
       const product = await Product.findOne({
         where:{
            id:id
         }
       })

       if (!product) throw new Error('Product not found');

        // Delete image from Cloudinary
      let publicId = product.imagePublicId; // Assuming your product model has `imagePublicId`
         
      if (publicId) {
         await cloudinary.uploader.destroy(publicId);
       }

      // Delete product from database
       const deletedProduct = await Product.destroy({
         where:{
            id:id
         }
       });
       if (!deletedProduct) throw new Error('Product not found');
       res.status(200).json({ message: 'Product and image deleted successfully' });
      } catch (error:any) {
         res.status(400).json({ message: error.message });
      }
       
    }


    
    //Update product
  
   async updatePrduct(req:AuthRequest,res:Response):Promise<void>{

   try {
      const id = req.params.id;
      const userId = req.user?.id;  // Foreign key for product
      const file = req.file;
      const { productName, productDescription, productPrice, productTotalStockQty, categoryId } = req.body;
      const product = await Product.findOne({
         where:{
            id:id
         }
      });

      if (!product) throw new Error('Product not found');

      let imageUrl = product.productImageUrl;
      let imagePublicId = product.imagePublicId;

      if (file) {
         // Delete old image from Cloudinary if it exists
         if (product.imagePublicId) {
           await cloudinary.uploader.destroy(product.imagePublicId);
         }
   
         // Upload new image to Cloudinary
         const uploadResult = await cloudinary.uploader.upload(file.path, {
           folder: 'parbhat'
         });
   
         imageUrl = uploadResult.secure_url;
         imagePublicId = uploadResult.public_id;
       }

            // Update product details
      const updatedProduct =  await Product.update({
                    productName,
                    productPrice,
                    productDescription,
                    productTotalStockQty,
                    productImageUrl:imageUrl,
                    userId,
                    categoryId,
                    imagePublicId:imagePublicId
                }, {
                    where: { 
                     id:id
                     }
                });

     res.status(200).json({ 
      message: "Product updated successfully" ,
      data:updatedProduct
   });
   } catch (error:any) {
      res.status(400).json({ message: error.message });
   }

}


}


export default new ProductController()