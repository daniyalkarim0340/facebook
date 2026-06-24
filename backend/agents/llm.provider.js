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

// ================= HUGGING FACE =================
const hf = new OpenAI({
  apiKey: process.env.HF_TOKEN,
  baseURL: 'https://router.huggingface.co/v1',
});

// ================= OPENROUTER =================
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'My AI Chatbot',
  },
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
      maxTokens ?? modelConfig?.maxTokens ?? 2048;

    // ================= OLLAMA =================
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

    // ================= HUGGING FACE =================
    if (modelConfig?.provider === 'huggingface') {
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

    // ================= OPENROUTER =================
    if (modelConfig?.provider === 'openrouter') {
      const completion = await openrouter.chat.completions.create({
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

    // ================= GROQ =================
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
      error: error?.message || 'Unknown error',
      model,
    });
  }
}