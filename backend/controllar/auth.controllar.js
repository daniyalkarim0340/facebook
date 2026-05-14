import asyncHandler from "express-async-handler";
import CustomError from "../handler/customerror.js";
import User from "../model/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/gernatetokens.js";
import bcrypt from "bcryptjs";

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
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new CustomError("Please fill all fields", 400));
  }

  const exists = await User.findOne({ email });

  if (exists) {
    return next(new CustomError("Email already exists", 400));
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
});

// -------------------
// LOGIN
// -------------------
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new CustomError("Please fill all fields", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new CustomError("Invalid credentials", 400));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new CustomError("Invalid credentials", 400));
  }

  // TOKENS
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // SAVE REFRESH TOKEN (ARRAY)
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  await user.save();

  // COOKIE
  res.cookie("refreshToken", refreshToken, cookieOption);

  res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    user,
  });
});

// -------------------
// LOGOUT
// -------------------
export const logoutUser = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Already logged out",
    });
  }

  const user = await User.findOne({
    "refreshTokens.token": refreshToken,
  });

  if (user) {
    user.refreshTokens = user.refreshTokens.filter(
      (t) => t.token !== refreshToken
    );

    await user.save();
  }

  res.clearCookie("refreshToken", cookieOption);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});


export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return next(new CustomError("No refresh token found", 401));
  }

  // VERIFY TOKEN
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  } catch (err) {
    return next(new CustomError("Invalid refresh token", 403));
  }

  // FIND USER
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  // CHECK TOKEN EXISTS IN DB (VERY IMPORTANT SECURITY STEP)
  const storedToken = user.refreshTokens.find(
    (t) => t.token === refreshToken
  );

  if (!storedToken) {
    return next(new CustomError("Refresh token not valid anymore", 403));
  }

  // GENERATE NEW ACCESS TOKEN
  const newAccessToken = generateAccessToken(user._id);

  return res.status(200).json({
    success: true,
    accessToken: newAccessToken,
  });
});