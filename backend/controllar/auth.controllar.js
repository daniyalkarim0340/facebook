import asyncHandler from "express-async-handler.js";

import Customerror from "../utils/customerror.js";

const register=asyncHandler(async(req,res,next)=>{
   const {name,email,password}=req.body
   const emailexist= await  User.findone(email)
   if(emailexist){
    return next(new Customerror(400,"email is allready exist"))
   }


})