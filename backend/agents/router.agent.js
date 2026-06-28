import { completeChat } from './llm.provider.js';
import {
  AGENT_IDS,
  EXPLICIT_SEARCH_TRIGGERS,
  ROUTER_MODEL,
} from './agent.config.js';

// Valid array layer for sanitizing routed agent allocations
const VALID_AGENTS = [
  AGENT_IDS.RESEARCH,
  AGENT_IDS.CODE,
  AGENT_IDS.WRITER,
  AGENT_IDS.ANALYST,
  AGENT_IDS.GENERAL,
  AGENT_IDS.IMAGE,
  AGENT_IDS.COMPUTER,
  AGENT_IDS.GENERATE_PROMPT,
];

function regexRoute(message) {
  const lower = message.toLowerCase();

  // ── 💻 System & Computer Automation Patterns Check ─────────────────
  const computerPatterns = /\b(open|launch|run|close|kill|terminate|make|create|build|delete|remove|folder|file|directory|restart|reboot|shutdown|lock|power off)\b/i;
  if (computerPatterns.test(lower)) {
    return { 
      primaryAgent: AGENT_IDS.COMPUTER, 
      needsSearch: false, 
      confidence: 0.85, 
      reasoning: 'System command or folder/file automation keyword detected (Regex Fallback)' 
    };
  }
  // ── 🧠 Prompt Engineering Agent ─────────────────────────────
const promptPatterns =
  /\b(prompt|improve prompt|optimize prompt|rewrite prompt|prompt engineering|generate prompt|create prompt|better prompt|system prompt|ai prompt|prompt engineer)\b/i;

if (promptPatterns.test(lower)) {
  return {
    primaryAgent: AGENT_IDS.GENERATE_PROMPT,
    needsSearch: false,
    confidence: 0.95,
    reasoning: 'Prompt engineering request detected (Regex Fallback)',
  };
}

  // ── 🟩 Image Asset Prompt Trigger Check ─────────────────────────────
  // Added to ensure the image pipeline functions even if the LLM fails
  const imagePatterns = /\b(generate image|create image|make image|draw image|generate an image|illustration|logo|avatar)\b/i;
  if (imagePatterns.test(lower)) {
    return {
      primaryAgent: AGENT_IDS.IMAGE,
      needsSearch: false,
      confidence: 0.85,
      reasoning: 'Visual asset generation or design keyword detected (Regex Fallback)'
    };
  }

  if (EXPLICIT_SEARCH_TRIGGERS.some((t) => lower.includes(t))) {
    return { primaryAgent: AGENT_IDS.RESEARCH, needsSearch: true, confidence: 0.9, reasoning: 'Explicit search request (Regex Fallback)' };
  }

  const codePatterns = /\b(code|debug|function|api|react|node|javascript|python|bug|error|typescript|database|sql|mongodb|implement|refactor)\b/i;
  if (codePatterns.test(lower)) {
    return { primaryAgent: AGENT_IDS.CODE, needsSearch: false, confidence: 0.75, reasoning: 'Programming keywords detected (Regex Fallback)' };
  }

  const writerPatterns = /\b(write|email|essay|blog|article|letter|story|poem|copy|draft|rewrite)\b/i;
  if (writerPatterns.test(lower)) {
    return { primaryAgent: AGENT_IDS.WRITER, needsSearch: false, confidence: 0.75, reasoning: 'Writing task detected (Regex Fallback)' };
  }

  const analystPatterns = /\b(analyze|compare|pros and cons|evaluate|strategy|breakdown|assess|recommend|decision)\b/i;
  if (analystPatterns.test(lower)) {
    return { primaryAgent: AGENT_IDS.ANALYST, needsSearch: false, confidence: 0.75, reasoning: 'Analysis task detected (Regex Fallback)' };
  }

  const newsPatterns = /\b(latest|today|current|news|2026|recent|trending|price of|stock)\b/i;
  if (newsPatterns.test(lower)) {
    return { primaryAgent: AGENT_IDS.RESEARCH, needsSearch: true, confidence: 0.7, reasoning: 'Time-sensitive query detected (Regex Fallback)' };
  }

  return { primaryAgent: AGENT_IDS.GENERAL, needsSearch: false, confidence: 0.5, reasoning: 'Default general routing (Regex Fallback)' };
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
  const routePrompt = `
You are an ultra-precise AI routing engine.

Your ONLY job is to classify the user message into exactly ONE primary agent with strict accuracy.

You must NOT answer the question. You must NOT be helpful. You ONLY route.

────────────────────────────────────
AVAILABLE AGENTS (STRICT DEFINITIONS)
────────────────────────────────────

1. research
Use when:
- real-time or factual lookup needed
- news, current events, prices, trends
- anything requiring external knowledge

2. code
Use when:
- programming, debugging, APIs
- frontend/backend development
- JavaScript, Python, SQL, TypeScript
- error fixing or system design

3. writer
Use when:
- writing content (email, essay, blog, story, script)
- rewriting or improving text
- formatting or copywriting tasks

4. analyst
Use when:
- comparisons, pros/cons
- decision-making or evaluation
- strategy, breakdown, reasoning

5. image
Use ONLY when:
- user requests image generation
- logo, avatar, illustration, drawing, visual design

6. computer
Use ONLY when:
- OS-level actions
- file/folder operations
- open/close apps
- system automation commands
- restart/shutdown/terminal actions

7. general
Use ONLY if nothing above clearly matches.

────────────────────────────────────
CRITICAL DECISION RULES
────────────────────────────────────

- ALWAYS pick the MOST SPECIFIC agent.
- If multiple agents match → choose the MOST ACTION-ORIENTED one.
- "code" beats "writer" if programming is involved.
- "research" beats all when time-sensitive or factual uncertainty exists.
- "computer" overrides everything ONLY if system operation is explicit.
- NEVER choose multiple primary agents.

────────────────────────────────────
NEEDS SEARCH RULE
────────────────────────────────────

Set needsSearch = true ONLY if:
- research agent is selected AND
- query involves time-sensitive or external knowledge

Otherwise false.

────────────────────────────────────
OUTPUT FORMAT (STRICT JSON ONLY)
────────────────────────────────────

Return ONLY valid JSON. No markdown. No explanation.

{
  "primaryAgent": "research|code|writer|analyst|image|computer|general",
  "secondaryAgents": [],
  "needsSearch": false,
  "confidence": 0.0-1.0,
  "reasoning": "one short precise reason"
}

────────────────────────────────────
EXAMPLES (FOR ACCURACY)
────────────────────────────────────

Input: "build a react login form"
→ code

Input: "write an email to manager"
→ writer

Input: "compare iPhone vs Samsung"
→ analyst

Input: "latest bitcoin price"
→ research

Input: "create a logo for my brand"
→ image

Input: "open chrome and delete temp file"
→ computer

Input: "what is photosynthesis"
→ research

Now classify the user message with maximum accuracy:
"${message}"
`;

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

    // Clean out accidental markdown backticks (\`\`\`json ... \`\`\`) to isolate the raw JSON text
    const cleanJsonString = raw
      .replace(/^```json/i, '')
      .replace(/```$/, '')
      .trim();

    const parsed = JSON.parse(cleanJsonString);
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
    console.warn('Router LLM fallback triggered:', err.message);
    return regexRoute(message);
  }
}