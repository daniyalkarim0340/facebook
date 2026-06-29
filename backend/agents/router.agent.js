import { completeChat } from "./llm.provider.js";
import { AGENT_IDS, EXPLICIT_SEARCH_TRIGGERS, ROUTER_MODEL } from "./agent.config.js";
import { ROUTER_PROMPTS } from "./router.prompts.js";
import { logRoutingEvent } from "./router.logger.js";
import { scoreRouting } from "./router.scorer.js";

let ACTIVE_PROMPT_VERSION = "v2";

const VALID_AGENTS = Object.values(AGENT_IDS);

export async function routeToAgent(message, history = [], forcedAgent = null, userFeedback = null) {
  if (forcedAgent && VALID_AGENTS.includes(forcedAgent)) {
    return {
      primaryAgent: forcedAgent,
      secondaryAgents: [],
      needsSearch: forcedAgent === AGENT_IDS.RESEARCH,
      confidence: 1,
      reasoning: "User override"
    };
  }

  const routePrompt = ROUTER_PROMPTS[ACTIVE_PROMPT_VERSION].replace(
    "${message}",
    message
  );

  try {
    const raw = await completeChat({
      model: ROUTER_MODEL,
      temperature: 0,
      maxTokens: 200,
      jsonMode: true,
      messages: [
        { role: "system", content: "Return ONLY JSON." },
        { role: "user", content: routePrompt }
      ]
    });

    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    const result = {
      primaryAgent: VALID_AGENTS.includes(parsed.primaryAgent)
        ? parsed.primaryAgent
        : AGENT_IDS.GENERAL,
      secondaryAgents: [],
      needsSearch: !!parsed.needsSearch,
      confidence: parsed.confidence ?? 0.8,
      reasoning: parsed.reasoning || "LLM routing"
    };

    // 🔥 SCORING (self-learning signal)
    const score = scoreRouting({
      predicted: result.primaryAgent,
      userFeedback
    });

    // 📦 LOG EVERYTHING
    logRoutingEvent({
      message,
      predicted: result.primaryAgent,
      score,
      userFeedback
    });

    return result;

  } catch (err) {
    console.warn("Router fallback:", err.message);
    return {
      primaryAgent: AGENT_IDS.GENERAL,
      needsSearch: false,
      confidence: 0.4,
      reasoning: "Fallback regex"
    };
  }
}