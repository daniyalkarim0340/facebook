import express from 'express';

import { generateImage, understandImage } from '../controllar/image.controllar.js';
import upload from '../authmiddleware/multer.js';

const ImageRouter = express.Router();

// 🎨 Generation route (No input files needed from frontend, uses raw JSON payload strings)
ImageRouter.post('/generate-image', generateImage);

// 👁️ Vision interpretation route (Expects an attachment file matching key name 'image')
ImageRouter.post('/understand-image', upload.single('image'), understandImage);

export default ImageRouter;



