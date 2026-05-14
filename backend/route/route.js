import { Router } from "express";
import {
  register,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllar/auth.controllar.js";

const authroute = Router();

authroute.post("/register", register);
authroute.post("/login", loginUser);
authroute.post("/logout", logoutUser);
authroute.post("/refresh-token", refreshAccessToken);

export default authroute;