

export interface OrderData{
    phoneNumber:string,
    shippingAddress:string,
    totalAmount:number,
    paymentDetails:{
        paymentMethod:PaymentMethod,
        paymentStatus?:PaymentStatus,
        pidx?:string
    },

    items: OrderDetails[]
}

export interface OrderDetails{
    quantity:number,
    productId:string
}

export enum PaymentMethod{
    cod="Cod",
    khalti ="khalti",

}

export enum PaymentStatus{
    Paid="paid",
    Unpaid="unpaid"
}

export interface KhaltiResponse{
    pidx:string,
    payment_url:string,
    expires_at:Date|string,
    expires_in:number
}

export interface TransactionResponse{
    pidx: string,
   total_amount:number,
   status:TransactionStatus,
   transaction_id:string,
   fee: number,
   refunded:boolean
}

 export enum TransactionStatus{
    Completed="Completed",
    Pending="Pending",
    Refunded="Refunded",
    Initiated="Initiated"
 }

 export enum OrderStatus{
    Pending="pending",
    Cancelled="cancelled",
    Delivered="delivered",
    Ontheway="ontheway",
    Preparation="preparation"

 }