import express from 'express';
import multer from 'multer';
import { generateImage, understandImage } from '../controllar/image.controllar.js';


const ImageRouter = express.Router();

// 💾 Configure Multer to temporarily hold uploads in RAM
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB max file size limit for uploads
  }
});

/**
 * @route   POST /api/ai/generate-image
 * @desc    Accepts JSON body: { "prompt": "your text here" }
 * @access  Public
 */
ImageRouter.post('/generate-image', generateImage);

/**
 * @route   POST /api/ai/understand-image
 * @desc    Accepts Multipart Form Data with a file attached to the 'image' field
 * @access  Public
 */
ImageRouter.post('/understand-image', upload.single('image'), understandImage);

export default ImageRouter;