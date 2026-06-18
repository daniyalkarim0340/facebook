import { completeChat } from './llm.provider.js';
import {
  AGENT_IDS,
  EXPLICIT_SEARCH_TRIGGERS,
  ROUTER_MODEL,
} from './agent.config.js';

const VALID_AGENTS = [
  AGENT_IDS.RESEARCH,
  AGENT_IDS.CODE,
  AGENT_IDS.WRITER,
  AGENT_IDS.ANALYST,
  AGENT_IDS.GENERAL,
];

function regexRoute(message) {
  const lower = message.toLowerCase();

  if (EXPLICIT_SEARCH_TRIGGERS.some((t) => lower.includes(t))) {
    return { primaryAgent: AGENT_IDS.RESEARCH, needsSearch: true, confidence: 0.9, reasoning: 'Explicit search request' };
  }

  const codePatterns = /\b(code|debug|function|api|react|node|javascript|python|bug|error|typescript|database|sql|mongodb|implement|refactor)\b/i;
  if (codePatterns.test(lower)) {
    return { primaryAgent: AGENT_IDS.CODE, needsSearch: false, confidence: 0.75, reasoning: 'Programming keywords detected' };
  }

  const writerPatterns = /\b(write|email|essay|blog|article|letter|story|poem|copy|draft|rewrite)\b/i;
  if (writerPatterns.test(lower)) {
    return { primaryAgent: AGENT_IDS.WRITER, needsSearch: false, confidence: 0.75, reasoning: 'Writing task detected' };
  }

  const analystPatterns = /\b(analyze|compare|pros and cons|evaluate|strategy|breakdown|assess|recommend|decision)\b/i;
  if (analystPatterns.test(lower)) {
    return { primaryAgent: AGENT_IDS.ANALYST, needsSearch: false, confidence: 0.75, reasoning: 'Analysis task detected' };
  }

  const newsPatterns = /\b(latest|today|current|news|2026|recent|trending|price of|stock)\b/i;
  if (newsPatterns.test(lower)) {
    return { primaryAgent: AGENT_IDS.RESEARCH, needsSearch: true, confidence: 0.7, reasoning: 'Time-sensitive query detected' };
  }

  return { primaryAgent: AGENT_IDS.GENERAL, needsSearch: false, confidence: 0.5, reasoning: 'Default general routing' };
}

export async function routeToAgent(message, history = [], forcedAgent = null) {
  if (forcedAgent && VALID_AGENTS.includes(forcedAgent)) {
    const needsSearch = forcedAgent === AGENT_IDS.RESEARCH
      || EXPLICIT_SEARCH_TRIGGERS.some((t) => message.toLowerCase().includes(t));
    return {
      primaryAgent: forcedAgent,
      secondaryAgents: [],
      needsSearch,
      confidence: 1,
      reasoning: `User selected ${forcedAgent} agent`,
    };
  }

  try {
    const routePrompt = `You are the Router Agent in a multi-agent AI system (year 2026).
Pick the BEST specialist agent for the user's message.

Agents:
- research: real-time facts, news, web lookups, current events
- code: programming, debugging, architecture, APIs, databases
- writer: emails, essays, blogs, creative writing, copy
- analyst: comparisons, pros/cons, strategy, structured analysis
- general: everything else

Also decide if live web search is required (needsSearch: true for recent/live facts).

User message: "${message}"

Reply with ONLY valid JSON:
{
  "primaryAgent": "research|code|writer|analyst|general",
  "secondaryAgents": [],
  "needsSearch": true|false,
  "confidence": 0.0-1.0,
  "reasoning": "brief reason"
}`;

    const raw = await completeChat({
      model: ROUTER_MODEL,
      temperature: 0,
      maxTokens: 200,
      jsonMode: true,
      messages: [
        { role: 'system', content: 'Output raw JSON only. No markdown.' },
        ...history.slice(-2),
        { role: 'user', content: routePrompt },
      ],
    });

    const parsed = JSON.parse(raw.trim());
    const primaryAgent = VALID_AGENTS.includes(parsed.primaryAgent)
      ? parsed.primaryAgent
      : AGENT_IDS.GENERAL;

    return {
      primaryAgent,
      secondaryAgents: (parsed.secondaryAgents || []).filter((a) => VALID_AGENTS.includes(a)),
      needsSearch: !!parsed.needsSearch,
      confidence: parsed.confidence ?? 0.8,
      reasoning: parsed.reasoning || 'LLM router decision',
    };
  } catch (err) {
    console.warn('Router LLM fallback:', err.message);
    return regexRoute(message);
  }
}
