import { AuthRequest } from "../middleware/middleware";
import {Request, Response } from "express";
import { KhaltiResponse, OrderData, OrderStatus, PaymentMethod, PaymentStatus, TransactionResponse, TransactionStatus } from "../types/orderTypes";
import Order from "../database/models/order";
import Payment from "../database/models/payment";
import OrderDetail from "../database/models/orderDetails";
import axios from "axios";
import Product from "../database/models/productModel";


class ExtendedOrder extends Order{
    declare paymentId:string|null
}

class OrderController{

    //Create operation

    async createOrder(req:AuthRequest,res:Response):Promise<void>{
        const {shippingAddress,phoneNumber,totalAmount,paymentDetails,items}:OrderData = req.body
        const userId = req.user?.id
        if(!phoneNumber||!shippingAddress||!totalAmount||!paymentDetails||!paymentDetails.paymentMethod||items.length==0){
            res.status(400).json({
             message:"please provide shippingAddress,phoneNumber,totalAmount,paymentDetails,items"
            })
            return
        }
       
       
      const paymentData = await Payment.create({
            paymentMethod:paymentDetails.paymentMethod
        })
        const orderData = await Order.create({
            phoneNumber,
            shippingAddress,
            totalAmount,
            userId,
            paymentId:paymentData.id

        })
        

        for(let i=0;i<items.length;i++){
            await OrderDetail.create({
                quantity:items[i].quantity,
                productId:items[i].productId,
                orderId:orderData.id
              })
        }
        if(paymentDetails.paymentMethod===PaymentMethod.khalti){

            //khalti integration
            const data ={
                return_url:"http://localhost:3000/success", //payment success vayo vane khalti le kun page ma redirect garne vanne kura ho
                purchase_order_id:orderData.id,
                amount:totalAmount*100, //khalti le rupees ma accept gardaina paisa ma accept garxa.
                website_url:"http://localhost:3000/",//hamro site ko url ho
                purchase_order_name:"orderName_"+ orderData.id,// order name ho//but hami j name handa ni junxa hello bye.
            }
            //api hit hanne 
         const response =  await axios.post('https://a.khalti.com/api/v2/epayment/initiate/',data,{
                headers:{
                    "Authorization":"key c8c761f767da48b0a521390401f85d44"
                }
            })
            // console.log(response)
    
            const khaltiResponse:KhaltiResponse=response.data
            paymentData.pidx=khaltiResponse.pidx
            // paymentData.paymentStatus="paid" //verify nagari payment status "paid" gareko
            paymentData.save()
            res.status(200).json({
                message:"order placed successfully",
                url:khaltiResponse.payment_url
            })
           
        }else{
            res.status(200).json({
                message:"order placed successfully"
            })
        }
         
    }



    // verify pidx
    async verifyTransaction(req:AuthRequest,res:Response):Promise<void>{
        const {pidx}=req.body
        if(!pidx){
            res.status(400).json({
                message:"please provide pidx"
            })
            return
        }
        const response = await axios.post("https://a.khalti.com/api/v2/epayment/lookup/",{pidx},{
            headers:{
                     "Authorization":"key c8c761f767da48b0a521390401f85d44"
            }
        })
        const data:TransactionResponse=response.data
        if(data.status===TransactionStatus.Completed){
            await Payment.update({paymentStatus:PaymentStatus.Paid},{
                where:{
                    pidx:pidx
                }
            })
            res.status(200).json({
                message:"payment verified successfully"
            })

        }else{
            res.status(200).json({
                message:"not verified"
            })
        }
    }


//Customer side starts here

async fetchMyOrders(req:AuthRequest,res:Response):Promise<void>{

    const userId = req.user?.id
    const orders=await Order.findAll({
        where:{
            userId:userId
        },
        include:[
            {                  //kunai table ma foreign key xa vane tyo lai join garna include:[{model:tablename}]
                model:Payment
            }
        ]
    })
    if(orders.length>0){
        res.status(200).json({
            messgae:"order fetched successfully",
            data:orders
        })
    }else{
        res.status(200).json({
            message:"you haven't ordered anything yet..",
            data:[]
        })
    }

}

async fetchOrderDetails(req:AuthRequest,res:Response):Promise<void>{
 const userId=req.user?.id
 const orderId = req.params.id
 const orderDetails = await OrderDetail.findAll({
    where:{
        orderId:orderId
    },
    include:[
        {
            model:Product
        }
    ]
 })

 if(orderDetails.length>0){
    res.status(200).json({
        message:"orderDetails fetched successfully",
        data:orderDetails
    })
 }else{
    res.status(400).json({
        message:"no any order details for that id",
        data:[]
    })
 }
}

async cancelOrder(req:AuthRequest,res:Response):Promise<void>{
    const userId=req.user?.id
    const orderId=req.params.id
    const order:any = await Order.findAll({
        where:{
            id:orderId
        }
    })
    if(order.orderStatus===OrderStatus.Ontheway||OrderStatus.Preparation){
        res.status(200).json({
            messsage:"You cannot cancell order it is in the ontheway or prepared"
        })
        return
    }
    await Order.update({
        OrderStatus:OrderStatus.Cancelled
    },{
        where:{
            id:orderId
        }
    })
    res.status(200).json({
        message:"Order cancelled successfully"
    })
}

//Customer side Ended here


//Admin side starts here

async changeOrderStatus(req:Request,res:Response):Promise<void>{
    const orderId=req.params.id
    const orderStatus:OrderStatus=req.body.orderStatus
    await Order.update({
        orderStatus:orderStatus
    },{
       where:{
        id:orderId
       }
    })
    res.status(200).json({
        message:"order status updated successfully"
    })
    
}


async changePaymentStatus(req:Request,res:Response):Promise<void>{
    const orderId = req.params.id
    const paymentStatus:PaymentStatus = req.body.paymentStatus
    const order = await Order.findByPk(orderId)
    const extendedOrder:ExtendedOrder=order as ExtendedOrder
    await Payment.update({
        paymentStatus:paymentStatus
    },{
        where:{
            id:extendedOrder.paymentId
        }
    })
    res.status(200).json({
        message:`payment status of orderId ${orderId} updated successfully to ${paymentStatus}`
    })
}


async deleteOrder(req:Request,res:Response):Promise<void>{
    const orderId = req.params.id
    const order:any = await Order.findByPk(orderId)
  
    if(order){

        await OrderDetail.destroy({
            where:{
                orderId:orderId
            }
        })

        await Payment.destroy({
            where:{
                id:order.paymentId
            }
        })

        await Order.destroy({
            where:{
                id:orderId
            }
        })
    
       
        res.status(200).json({
            message:"order deleted successfully"
        })
    }else{
        res.status(400).json({
            message:"no order with orderId"
        })
    }
}

}

export default new OrderController()