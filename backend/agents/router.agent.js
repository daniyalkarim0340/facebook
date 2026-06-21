import { completeChat } from './llm.provider.js';
import {
  AGENT_IDS,
  EXPLICIT_SEARCH_TRIGGERS,
  ROUTER_MODEL,
} from './agent.config.js';

// 🟩 FIXED: Added AGENT_IDS.COMPUTER to the valid array layer
const VALID_AGENTS = [
  AGENT_IDS.RESEARCH,
  AGENT_IDS.CODE,
  AGENT_IDS.WRITER,
  AGENT_IDS.ANALYST,
  AGENT_IDS.GENERAL,
  AGENT_IDS.IMAGE,
  AGENT_IDS.COMPUTER, // 👈 Added
];

function regexRoute(message) {
  const lower = message.toLowerCase();

  // ── 💻 NEW: System & Computer Automation Patterns Check ─────────────────
  // Placed high up so actionable OS triggers intercept smoothly
  const computerPatterns = /\b(open|launch|run|close|kill|terminate|make|create|build|delete|remove|folder|file|directory|restart|reboot|shutdown|lock|power off)\b/i;
  if (computerPatterns.test(lower)) {
    return { 
      primaryAgent: AGENT_IDS.COMPUTER, 
      needsSearch: false, 
      confidence: 0.85, 
      reasoning: 'System command or folder/file automation keyword detected' 
    };
  }

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
    // 🟩 FIXED: Added explicit computer task definition instructions to the prompt block
    const routePrompt = `You are a routing agent analyzing a user message.
User Message: "${message}"

Agents available:
- research: real-time facts, news, web lookups
- code: writing programs, complex developer code blocks, backend logic
- writer: emails, essays, blogs
- analyst: comparisons, strategy
- image: generating visual art, images, and pictures
- computer: operating system controls, creating/deleting folders or files, opening apps, running system actions, restarting/locking/shutting down PC
- general: everything else

Reply with ONLY valid JSON:
{
  "primaryAgent": "research|code|writer|analyst|general|image|computer",
  "secondaryAgents": [],
  "needsSearch": false,
  "confidence": 0.9,
  "reasoning": "Brief explanation text here"
}`;

    const raw = await completeChat({
      model: ROUTER_MODEL,
      temperature: 0,
      maxTokens: 200,
      jsonMode: true,
      messages: [
        { role: 'system', content: 'Output raw JSON only. No markdown text formatting wrappers inside the JSON.' },
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