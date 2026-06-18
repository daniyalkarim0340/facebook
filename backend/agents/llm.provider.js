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
  const tokenLimit = maxTokens ?? modelConfig.maxTokens;

  if (model === 'gemma3:4b') {
    const result = await ollama.chat({
      model: 'gemma3:4b',
      messages,
      options: {
        temperature,
        num_predict: tokenLimit,
      },
    });
    return result.message.content;
  }

  const completion = await groq.chat.completions.create({
    model,
    messages,
    temperature,
    top_p: 0.9,
    max_tokens: tokenLimit,
    ...(jsonMode && { response_format: { type: 'json_object' } }),
  });

  return completion.choices[0].message.content;
}
