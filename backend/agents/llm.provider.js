import dotenv from 'dotenv';
import { Groq } from 'groq-sdk';
import ollama from 'ollama';
import { AVAILABLE_MODELS, DEFAULT_MODEL } from './agent.config.js';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function completeChat({
  model = DEFAULT_MODEL,
  messages,
  temperature = 0.7,
  maxTokens,
  jsonMode = false,
}) {
  const modelConfig = AVAILABLE_MODELS[model] || AVAILABLE_MODELS[DEFAULT_MODEL];
  const tokenLimit = maxTokens ?? modelConfig?.maxTokens ?? 1024;

  // ── 🦙 OLLAMA LOCAL EXECUTION LAYER ──────────────────────────────────
  if (model === 'gemma3:4b' || modelConfig?.provider === 'ollama') {
    const result = await ollama.chat({
      model: 'gemma3:4b',
      messages,
      // 🟩 FIXED: Enforces structured JSON output natively inside Ollama
      format: jsonMode ? 'json' : undefined, 
      options: {
        temperature,
        num_predict: tokenLimit,
      },
    });
    return result.message.content;
  }

  // ── ⚡ GROQ CLOUD EXECUTION LAYER ────────────────────────────────────
  const completion = await groq.chat.completions.create({
    model,
    messages,
    temperature,
    top_p: 0.9,
    max_tokens: tokenLimit,
    // Enforces structured JSON output natively inside Groq
    ...(jsonMode && { response_format: { type: 'json_object' } }),
  });

  return completion.choices[0].message.content;
}