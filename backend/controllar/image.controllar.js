import fetch from 'node-fetch';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase.js'; // Import your storage config
import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

const HF_TOKEN = process.env.HF_TOKEN;

/**
 * @desc    Generate an image from text prompt and store it in Firebase
 * @route   POST /api/ai/generate-image
 */
export const generateImage = asyncHandler(async (req, res, next) => {
  const { prompt } = req.body;

  if (!prompt) {
    return next(new ErrorResponse('Prompt field is required', 400));
  }

  // 1. Fetch the image from Hugging Face
  const response = await fetch(
    'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
    {
      headers: { Authorization: `Bearer ${HF_TOKEN}` },
      method: 'POST',
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (response.status === 503) {
    return next(new ErrorResponse('Model is loading. Please retry in a few seconds.', 503));
  }

  if (!response.ok) {
    return next(new ErrorResponse(`Hugging Face error: ${response.statusText}`, response.status));
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 2. Prepare unique filename for Firebase Storage
  const fileName = `generated/${Date.now()}_ai_image.png`;
  const storageRef = ref(storage, fileName);

  // 3. Upload the image buffer to Firebase
  const metadata = { contentType: 'image/png' };
  await uploadBytes(storageRef, buffer, metadata);

  // 4. Get the permanent downloadable web URL
  const downloadURL = await getDownloadURL(storageRef);

  // 5. Send the URL back to your React frontend!
  // (You would also save this downloadURL to your MongoDB chat history schema here)
  return res.status(200).json({
    success: true,
    imageUrl: downloadURL
  });
});

/**
 * @desc    Analyze an uploaded image (Pass-through mode)
 * @route   POST /api/ai/understand-image
 */
export const understandImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  // Send directly to Hugging Face for analysis 
  const response = await fetch(
    'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
    {
      headers: { Authorization: `Bearer ${HF_TOKEN}` },
      method: 'POST',
      body: req.file.buffer,
    }
  );

  if (!response.ok) {
    return next(new ErrorResponse(`Hugging Face error: ${response.statusText}`, response.status));
  }

  const result = await response.json();
  const caption = result[0]?.generated_text || 'No description could be generated.';

  return res.status(200).json({ 
    success: true, 
    description: caption 
  });
});