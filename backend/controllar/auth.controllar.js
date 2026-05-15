import asyncHandler from "express-async-handler";
import CustomError from "../handler/customerror.js";
import User from "../model/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/gernatetokens.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import eventBus from "../eventbus/eventBus.js";
import Userevent from "../eventbus/event.const.js";

// -------------------
// COOKIE OPTIONS
// -------------------
const cookieOption = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// -------------------
// REGISTER
// -------------------
export const register = asyncHandler(async (req, res, next) => {
  console.log("Registering user:", req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.log("Missing fields");
    return next(new CustomError(400,"Please fill all fields"));
  }

  const exists = await User.findOne({ email });
  console.log("User exists:", exists ? "Yes" : "No");

  if (exists) {
    return next(new CustomError(400,"Email already exists"));
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

   // create user
   const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
   });
       res.status(201).json({
      success: true,
      message: "User registered successfully. OTP sent to email."
   });


   // emit otp event
   eventBus.emit(Userevent.SEND_OTP, {
      name: user.name,
      email: user.email,
      otp: user.otp,
   });
  
});


export const resendOtp = asyncHandler(async (req, res) => {

   const { email } = req.body;

   // 1. check email
   if (!email) {
      return res.status(400).json({
         success: false,
         message: "Email is required"
      });
   }

   // 2. find user
   const user = await User.findOne({ email });

   if (!user) {
      return res.status(404).json({
         success: false,
         message: "User not found"
      });
   }

   // 3. check if already verified
   if (user.isVerified) {
      return res.status(400).json({
         success: false,
         message: "User already verified"
      });
   }

   // 4. generate new OTP
   const otp = Math.floor(100000 + Math.random() * 900000).toString();

   // 5. update user OTP
   user.otp = otp;
   user.otpExpiry = Date.now() + 5 * 60 * 1000;

   await user.save();

   console.log("🔁 New OTP generated:", otp);

   // 6. emit event to send email
   eventBus.emit(Userevent.SEND_OTP, {
      name: user.name,
      email: user.email,
      otp
   });

   return res.status(200).json({
      success: true,
      message: "OTP resent successfully"
   });

});
export const verifyOtp = asyncHandler(async (req, res) => {

   const { otp } = req.body;

   if (!otp) {
      return res.status(400).json({
         success: false,
         message: "OTP is required"
      });
   }

   // find user by OTP
   const user = await User.findOne({ otp });

   if (!user) {
      return res.status(400).json({
         success: false,
         message: "Invalid OTP"
      });
   }

   // check expiry
   if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
         success: false,
         message: "OTP expired"
      });
   }

   // verify user
   user.isVerified = true;
   user.otp = null;
   user.otpExpiry = null;

   await user.save();

   res.status(200).json({
      success: true,
      message: "OTP verified successfully"
   });
});


// -------------------
// LOGIN
// -------------------
export const loginUser = asyncHandler(async (req, res, next) => {
  console.log("Logging in user:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new CustomError(400,"Please fill all fields"));
  }

  const user = await User.findOne({ email });
  console.log("User found:", user ? "Yes" : "No");

  if (!user) {
    return next(new CustomError(400,"Invalid credentials"));
  }

  console.log("Comparing passwords...");
  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Password match:", isMatch);

  if (!isMatch) {
    return next(new CustomError(400,"Invalid credentials"));
  }

  // TOKENS
  console.log("Generating tokens...");
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // SAVE REFRESH TOKEN (ARRAY)
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  console.log("Saving user...");
  await user.save();
  console.log("User saved.");

  // COOKIE
  res.cookie("refreshToken", refreshToken, cookieOption);

  res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
  
  });
});



// -------------------
// LOGOUT
export const logoutUser = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  // 1. If no token, we consider the job done. 
  // No need to throw an error; just ensure the cookie is gone.
  if (!refreshToken) {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }

  // 2. Remove the specific token from the user's array in one DB call
  await User.findOneAndUpdate(
    { "refreshTokens.token": refreshToken },
    { $pull: { refreshTokens: { token: refreshToken } } }
  );

  // 3. Clear the cookie with matching options
  // Ensure 'cookieOption' contains the same path/domain as your login logic
  res.clearCookie("refreshToken", {
    ...cookieOption,
    maxAge: 0, // Force immediate expiration
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return next(new CustomError(401,"No refresh token found"));
  }

  // VERIFY TOKEN
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return next(new CustomError(403,"Invalid refresh token"));
  }

  // FIND USER
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new CustomError(404,"User not found"));
  }

  // CHECK TOKEN EXISTS IN DB (VERY IMPORTANT SECURITY STEP)
  const storedToken = user.refreshTokens.find(
    (t) => t.token === refreshToken
  );

  if (!storedToken) {
    return next(new CustomError(403,"Refresh token not valid anymore"));
  }

  // GENERATE NEW ACCESS TOKEN
  const newAccessToken = generateAccessToken(user._id);

  return res.status(200).json({
    success: true,
    accessToken: newAccessToken,
  });
});