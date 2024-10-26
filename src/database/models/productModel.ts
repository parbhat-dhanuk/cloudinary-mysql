import {Table,Column,Model,DataType} from "sequelize-typescript"

@Table({
    tableName:"products",
    modelName:"Product",
    timestamps:true
})

class Product extends Model{
    
    @Column({
        primaryKey:true,
        type:DataType.UUID,
        defaultValue:DataType.UUIDV4
    })
    declare id:string

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    declare productName:string

    @Column({
        type:DataType.TEXT  //multiple dheraii content leknu xa vane TEXT hunxa thorai character xa vane STRING halne.
    })
    declare productDescription:string

    @Column({
        type:DataType.INTEGER
    })
    declare productPrice:number

    @Column({
      type:DataType.INTEGER
    })
    declare productTotalStockQty:number
    
    @Column({
        type:DataType.STRING
      })
      declare productImageUrl:string
 
      @Column({
        type:DataType.STRING,
        allowNull:false

      })
      declare imagePublicId:string
}

export default  Product