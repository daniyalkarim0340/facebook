import express from 'express';
import { generateImage } from '../controllar/image.controller.js';

// Replace this with your actual auth middleware if you want to protect this route
// import { protectRoute } from '../middleware/auth.middleware.js'; 

const imageRoutes = express.Router();

// Route: POST /api/v1/images/generate
imageRoutes.post('/generate', generateImage);

export default imageRoutes;