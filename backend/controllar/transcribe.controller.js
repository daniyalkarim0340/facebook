import fs from "fs";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

export const transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No audio file provided",
      });
    }

    const filePath = req.file.path;
    
    // Read file as buffer
    const audioBuffer = fs.readFileSync(filePath);

    // Send to Hugging Face API using a model that doesn't require fal-ai
    // Using openai/whisper-base which is directly hosted on Hugging Face
    const result = await hf.automaticSpeechRecognition({
      model: "openai/whisper-base",
      data: audioBuffer,
    });

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      text: result.text,
    });
  } catch (error) {
    console.error("Transcription error:", error);

    // Clean up file if it exists
    try {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (cleanupError) {
      console.error("Error cleaning up file:", cleanupError);
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to transcribe audio",
    });
  }
};