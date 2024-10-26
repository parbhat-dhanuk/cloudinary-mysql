import { Request,Response} from "express";

const errorHandler = (fn:Function)=>{
    return (req:Request,res:Response)=>{
        fn(req,res).catch((err:Error)=>{
            return res.status(500).json({
                message:"Internal Error",
                errMessage:err.message
            })
        })                                 // try catch ko global function ho.yo function chai routes ma gayera halne.
    }
}

export default errorHandler