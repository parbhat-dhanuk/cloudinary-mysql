import {ForeignKey, Sequelize} from "sequelize-typescript"
import User from "./models/userModel"
import Product from "./models/productModel"
import Category from "./models/category"
import Cart from "./models/cart"
import Payment from "./models/payment"
import Order from "./models/order"
import OrderDetail from "./models/orderDetails"

const sequelize= new Sequelize({
 database:process.env.DB_NAME,
 dialect:"mysql",
 username:process.env.DB_USERNAME,
 password:process.env.DB_PASSWORD,
 host:process.env.DB_HOST,
 port:Number(process.env.DB_PORT),

 models:[__dirname + "/models"]
})

sequelize.authenticate()
.then(()=>{
    console.log("connected")
}).catch((err)=>{
console.log(err)
})

sequelize.sync({force:false}).then(()=>{
 console.log("synced !!!")
})


//Relationsship 
// yo code le Product table ma userId vanne foreign key banuxa jo User table sanga connected hunxa.

User.hasMany(Product,{foreignKey:"userId"}) 
Product.belongsTo(User,{foreignKey:"userId"})

Category.hasOne(Product,{foreignKey:"categoryId"})
Product.belongsTo(Category,{foreignKey:"categoryId"})

Product.hasMany(Cart,{foreignKey:"productId"})
Cart.belongsTo(Product,{foreignKey:"productId"})

User.hasMany(Cart,{foreignKey:"userId"})
Cart.belongsTo(User,{foreignKey:"userId"})

//order -orderdetails relation

Order.hasMany(OrderDetail ,{foreignKey:"orderId"})
OrderDetail.belongsTo(Order,{foreignKey:"orderId"})

//orderdetails - product relation

Product.hasMany(OrderDetail,{foreignKey:"productId"})
OrderDetail.belongsTo(Product,{foreignKey:"productId"})

//order-payment relation

Payment.hasOne(Order,{foreignKey:"paymentId"})
Order.belongsTo(Payment,{foreignKey:"paymentId"})

//order-user relation
User.hasMany(Order,{foreignKey:"userId"})
Order.belongsTo(User,{foreignKey:"userId"})





export default sequelize