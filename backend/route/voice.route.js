import express from "express";
import multer from "multer";
import { transcribeAudio } from "../controllar/transcribe.controller.js";


const aurouter = express.Router();

const upload = multer({
  dest: "uploads/",
});

aurouter.post(
  "/transcribe",
  upload.single("audio"),
  transcribeAudio
);

export default aurouter;