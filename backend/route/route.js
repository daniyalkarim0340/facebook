import { Router } from "express";
import {
  register,
  loginUser,
  logoutUser,
  refreshAccessToken,
  verifyOtp,
  resendOtp,
} from "../controllar/auth.controllar.js";

const authroute = Router();

authroute.post("/register", register);
authroute.post("/verify-otp", verifyOtp);
authroute.post("/login", loginUser);
authroute.post("/logout", logoutUser);
authroute.post("/refresh-token", refreshAccessToken);
authroute.post("/resend-otp", resendOtp);

export default authroute;