import dotenv from 'dotenv';
import { Groq } from 'groq-sdk';
import OpenAI from 'openai';
import ollama from 'ollama';
import { AVAILABLE_MODELS, DEFAULT_MODEL } from './agent.config.js';

dotenv.config();

// Groq Client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// NVIDIA Client
const nvidia = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
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
    // OLLAMA MODELS
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
    // NVIDIA MODELS
    // =====================================================
    const nvidiaModels = [
      'qwen/qwen3-32b',
      'qwen/qwen3-coder-480b-a35b-instruct',
      'z-ai/glm-5.1',
    ];

    if (nvidiaModels.includes(model)) {
      const completion = await nvidia.chat.completions.create({
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
    // GROQ MODELS
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