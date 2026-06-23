import dotenv from 'dotenv';
import { Groq } from 'groq-sdk';
import OpenAI from 'openai';
import ollama from 'ollama';
import { AVAILABLE_MODELS, DEFAULT_MODEL } from './agent.config.js';

dotenv.config();

// ================= GROQ =================
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ================= HUGGING FACE ROUTER =================
const hf = new OpenAI({
  apiKey: process.env.HF_TOKEN,
  baseURL: 'https://router.huggingface.co/v1',
});

export async function completeChat({
  model = DEFAULT_MODEL,
  messages,
  temperature = 0.7,
  maxTokens,
  jsonMode = false,
}) {
  try {
    const modelConfig =
      AVAILABLE_MODELS[model] || AVAILABLE_MODELS[DEFAULT_MODEL];

    const tokenLimit =
      maxTokens ?? modelConfig?.maxTokens ?? 1024;

    // =====================================================
    // OLLAMA MODELS (LOCAL)
    // =====================================================
    if (modelConfig?.provider === 'ollama') {
      const result = await ollama.chat({
        model,
        messages,
        format: jsonMode ? 'json' : undefined,
        options: {
          temperature,
          num_predict: tokenLimit,
        },
      });

      return result.message.content;
    }

    // =====================================================
    // HUGGING FACE MODELS (NEW REPLACEMENT FOR NVIDIA)
    // =====================================================
    const hfModels = [
      'deepseek-ai/DeepSeek-V4-Pro:novita',
    ];

    if (hfModels.includes(model)) {
      const completion = await hf.chat.completions.create({
        model,
        messages,
        temperature,
        top_p: 0.9,
        max_tokens: tokenLimit,
        ...(jsonMode && {
          response_format: { type: 'json_object' },
        }),
      });

      return completion.choices[0].message.content;
    }

    // =====================================================
    // GROQ MODELS (CLOUD)
    // =====================================================
    const completion = await groq.chat.completions.create({
      model,
      messages,
      temperature,
      top_p: 0.9,
      max_tokens: tokenLimit,
      ...(jsonMode && {
        response_format: {
          type: 'json_object',
        },
      }),
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Model Error:', error);

    return JSON.stringify({
      success: false,
      error: error.message,
      model,
    });
  }
}