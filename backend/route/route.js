import { Router } from "express";
import { register } from "../controllar/auth.controllar.js";

const authroute=Router();

authroute.post("/register",register)
// authroute.post("/login",Lgoinuser)

export default authroute;