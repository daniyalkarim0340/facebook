import { completeChat } from "./llm.provider.js";

export async function optimizeRouterPrompt(logs, currentPrompt) {
  const prompt = `
You are a prompt optimization engine.

Your job is to improve an AI routing prompt based on failure logs.

CURRENT PROMPT:
${currentPrompt}

FAILED EXAMPLES:
${logs
  .filter(l => l.score < 0.6)
  .slice(0, 30)
  .map(l => `Input: ${l.message}
Predicted: ${l.predicted}
Actual: ${l.actual}`)
  .join("\n\n")}

TASK:
- Improve routing accuracy
- Fix misclassification patterns
- Add missing rules
- Keep prompt concise
- Output ONLY improved prompt text
`;

  const improved = await completeChat({
    model: "llama-3.1-70b",
    temperature: 0,
    messages: [
      { role: "system", content: "You improve AI system prompts." },
      { role: "user", content: prompt }
    ]
  });

  return improved;
}