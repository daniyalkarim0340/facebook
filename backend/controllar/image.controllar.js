import axios from 'axios';
import asyncHandler from 'express-async-handler';
import CustomError from '../handler/customerror.js';
import cloudinary from '../config/cloudinary.js';
import { ChatSession } from '../model/ai.model.js';

const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.GROQ;

/**
 * Helper utility to convert a Node.js memory buffer directly into a Cloudinary upload stream
 */
const streamUploadToCloudinary = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: 'image',
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(fileBuffer);
  });
};

/**
 * 🟩 REUSABLE HELPER ENGINE: Hits Pollinations, uploads to Cloudinary, and returns the secure URL
 */
export const executeImageGeneration = async (prompt) => {
  const encodedPrompt = encodeURIComponent(prompt);
  const response = await axios.get(
    `https://image.pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&nologo=true`,
    { responseType: 'arraybuffer', timeout: 30000 }
  );

  const buffer = Buffer.from(response.data);

  // Stream the buffer up into a folder called "generated_ai" on Cloudinary
  const cloudinaryResult = await streamUploadToCloudinary(buffer, 'generated_ai');
  
  return cloudinaryResult.secure_url;
};

/**
 * @desc    Generate an image using Pollinations AI (FLUX) and save directly to Cloudinary
 * @route   POST /api/ai/generate-image
 */
export const generateImage = asyncHandler(async (req, res, next) => {
  const { prompt, sessionId } = req.body;

  if (!prompt) return next(new CustomError(400, 'Prompt field is required'));
  if (!sessionId) return next(new CustomError(400, 'Session ID is required'));

  const chatSession = await ChatSession.findById(sessionId);
  if (!chatSession) return next(new CustomError(404, 'Chat session not found'));

  chatSession.messages.push({ role: 'user', content: prompt });
  await chatSession.save();

  try {
    // 🎨 Call our new helper function
    const optimizedSecureUrl = await executeImageGeneration(prompt);

    chatSession.messages.push({
      role: 'assistant',
      content: optimizedSecureUrl,
      model: 'flux-pollinations',
      toolUsed: 'Pollinations via Cloudinary'
    });
    await chatSession.save();

    return res.status(200).json({
      success: true,
      message: "Image generated and saved to Cloudinary successfully",
      imageUrl: optimizedSecureUrl,
      latestMessage: chatSession.messages[chatSession.messages.length - 1]
    });

  } catch (error) {
    return next(new CustomError(500, `Cloudinary/AI Upload Error: ${error.message}`));
  }
});

/**
 * @desc    Analyze an uploaded image via Groq Cloud
 * @route   POST /api/ai/understand-image
 */
export const understandImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new CustomError(400, 'Please upload an image file via form-data'));
  if (!GROQ_API_KEY) return next(new CustomError(500, 'Groq API Key missing from environment'));

  const optionalPrompt = String(req.body.prompt || '').trim();
  const promptText = optionalPrompt || 'Describe this image concisely for a social media feed caption.';

  try {
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: promptText },
              {
                type: 'image_url',
                image_url: { url: `data:${mimeType};base64,${base64Image}` }
              }
            ]
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const caption =
      groqResponse.data?.choices?.[0]?.message?.content ||
      'No text description generated.';

    const cloudinaryResult = await streamUploadToCloudinary(req.file.buffer, 'user_uploads');

    return res.status(200).json({
      success: true,
      description: caption,
      savedUrl: cloudinaryResult.secure_url,
      prompt: promptText
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.error ||
      error.message ||
      'Unknown Vision Processing Error';
    return next(new CustomError(500, `Vision Processing Failed: ${errorMessage}`));
  }
});










// const openai = new OpenAI({
//   apiKey: '$NVIDIA_API_KEY',
//   baseURL: 'https://integrate.api.nvidia.com/v1',
// })
 
// async function main() {
//   const completion = await openai.chat.completions.create({
//     model: "z-ai/glm-5.1",
//     messages: [{"role":"user","content":""}],
//     temperature: 1,
//     top_p: 1,
//     max_tokens: 16384,
    
//     stream: true
//   })
   
//   for await (const chunk of completion) {
//         process.stdout.write(chunk.choices[0]?.delta?.content || '')
    
//   }
  
// }

// main();



// https://build.nvidia.com/z-ai/glm-5.1