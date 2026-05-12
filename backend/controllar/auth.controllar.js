import asyncHandler from "express-async-handler";
import Customerror from "../handler/customerror.js";
import User from "../model/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/gernatetokens.js";
import bcrypt from "bcryptjs";

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // CHECK ALL FIELDS
  if (!name || !email || !password) {
    return next(new Customerror(400, "Please fill all fields"));
  }

  // CHECK EMAIL
  const emailexist = await User.findOne({ email });

  if (emailexist) {
    return next(new Customerror(400, "Email already exists"));
  }

  // CREATE USER
  const user = await User.create({
    name,
    email,
    password,
  });

  // RESPONSE
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
});

const Lgoinuser=asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return next(new Customerror(400,"Please fill all fields"))
    }
    const user=await User.findOne({email});
    if(!user){
        return next(new Customerror(400,"Invalid credentials"))
    }
    const comparepassword=await bcrypt.compare(password,user.password);
    if(!comparepassword){
        return next(new Customerror(400,"Invalid credentials"))
    }

   const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
    res.status(200).json({
        success:true,
        message:"User logged in successfully",
        accessToken,
        
    })
})

export { register, Lgoinuser };