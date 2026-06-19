import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase.js'; 
import asyncHandler from "express-async-handler";
import CustomError from "../handler/customerror.js";

// 🗄️ Import your exact ChatSession model
import { ChatSession } from '../models/chatSessionModel.js'; 

const HF_TOKEN = process.env.HF_TOKEN;

/**
 * @desc    Generate an image, upload to Firebase, and push to ChatSession messages array
 * @route   POST /api/ai/generate-image
 */
export const generateImage = asyncHandler(async (req, res, next) => {
  // 1. Get the prompt and the sessionId from the incoming request body
  const { prompt, sessionId } = req.body;

  if (!prompt) {
    return next(new CustomError('Prompt field is required', 400));
  }
  if (!sessionId) {
    return next(new CustomError('Session ID is required to map chat history', 400));
  }

  // 2. Find the active ChatSession document in MongoDB
  const chatSession = await ChatSession.findById(sessionId);
  if (!chatSession) {
    return next(new CustomError('Chat session not found', 404));
  }

  // 3. Push the user's prompt into the messages subdocument array
  chatSession.messages.push({
    role: 'user',
    content: prompt
  });
  await chatSession.save(); // Persist the user message right away

  // 4. Fetch the generated image from Hugging Face
  const response = await fetch(
    'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
    {
      headers: { Authorization: `Bearer ${HF_TOKEN}` },
      method: 'POST',
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (response.status === 503) {
    return next(new CustomError('Model is loading. Please retry in a few seconds.', 503));
  }

  if (!response.ok) {
    return next(new CustomError(`Hugging Face error: ${response.statusText}`, response.status));
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 5. Upload the image buffer to Firebase Storage
  const fileName = `generated/${Date.now()}_ai_image.png`;
  const storageRef = ref(storage, fileName);
  const metadata = { contentType: 'image/png' };
  
  await uploadBytes(storageRef, buffer, metadata);
  const downloadURL = await getDownloadURL(storageRef);

  // 6. Push the AI response into the subdocument array matching your exact properties
  chatSession.messages.push({
    role: 'assistant',
    content: downloadURL, // Storing the Firebase URL here satisfies 'required: true'
    model: 'stable-diffusion-xl-base-1.0',
    toolUsed: 'Stable Diffusion XL'
  });

  // Save the updated session document containing both new entries
  await chatSession.save();

  // 7. Return the response to your React frontend
  return res.status(200).json({
    success: true,
    message: "Image generated and pushed to session records",
    latestMessage: chatSession.messages[chatSession.messages.length - 1] 
  });
});

/**
 * @desc    Analyze an uploaded image (Pass-through mode)
 * @route   POST /api/ai/understand-image
 */
export const understandImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new CustomError('Please upload an image file', 400));
  }

  const response = await fetch(
    'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
    {
      headers: { Authorization: `Bearer ${HF_TOKEN}` },
      method: 'POST',
      body: req.file.buffer,
    }
  );

  if (!response.ok) {
    return next(new CustomError(`Hugging Face error: ${response.statusText}`, response.status));
  }

  const result = await response.json();
  const caption = result[0]?.generated_text || 'No description could be generated.';

  return res.status(200).json({ 
    success: true, 
    description: caption 
  });
});