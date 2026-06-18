export const AVAILABLE_MODELS = {
  'llama-3.3-70b-versatile': { name: 'Llama 3.3 70B (Powerful Reasoning)', maxTokens: 4096 },
  'llama-3.1-8b-instant': { name: 'Llama 3.1 8B (Ultra Fast)', maxTokens: 2048 },
  'openai/gpt-oss-20b': { name: 'GPT-OSS 20B (Efficient)', maxTokens: 4096 },
  'qwen/qwen3-32b': { name: 'Qwen3 32B (Multilingual/Code)', maxTokens: 4096 },
  'meta-llama/llama-4-scout-17b-16e-instruct': { name: 'Llama 4 Scout (Agentic)', maxTokens: 4096 },
  'gemma3:4b': { name: 'Gemma 3 4B (Local Ollama)', maxTokens: 4096 },
};

export const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
export const ROUTER_MODEL = 'llama-3.1-8b-instant';

export const AGENT_IDS = {
  ROUTER: 'router',
  RESEARCH: 'research',
  CODE: 'code',
  WRITER: 'writer',
  ANALYST: 'analyst',
  GENERAL: 'general',
};

export const AGENTS = {
  [AGENT_IDS.ROUTER]: {
    id: AGENT_IDS.ROUTER,
    name: 'Router Agent',
    description: 'Analyzes user intent and delegates to the best specialist agent.',
    icon: '🔀',
    role: 'orchestrator',
  },
  [AGENT_IDS.RESEARCH]: {
    id: AGENT_IDS.RESEARCH,
    name: 'Research Agent',
    description: 'Searches the live web and synthesizes up-to-date facts and sources.',
    icon: '🔍',
    role: 'specialist',
    tools: ['web_search'],
    systemPrompt: `You are the Research Agent in a multi-agent AI system. The current year is 2026.
You specialize in finding accurate, up-to-date information using real-time web context.
- Prioritize facts from the provided web context
- Cite sources (title/URL) when using web data
- Be thorough but concise
- Flag uncertainty when sources conflict
- Never fabricate URLs or statistics`,
  },
  [AGENT_IDS.CODE]: {
    id: AGENT_IDS.CODE,
    name: 'Code Agent',
    description: 'Expert software engineer for coding, debugging, and system design.',
    icon: '💻',
    role: 'specialist',
    systemPrompt: `You are the Code Agent in a multi-agent AI system. The current year is 2026.
You are an elite senior software engineer and architect.
- Write clean, production-ready code with best practices
- Explain trade-offs, edge cases, and security considerations
- Use proper code blocks with language tags
- Cover debugging steps when fixing issues
- Recommend scalable patterns for MERN, React, Node.js, and AI systems
- Think step-by-step before complex solutions`,
  },
  [AGENT_IDS.WRITER]: {
    id: AGENT_IDS.WRITER,
    name: 'Writer Agent',
    description: 'Creates polished content — emails, essays, blogs, and creative copy.',
    icon: '✍️',
    role: 'specialist',
    systemPrompt: `You are the Writer Agent in a multi-agent AI system.
You craft clear, engaging, well-structured written content.
- Match tone to the user's request (formal, casual, persuasive, etc.)
- Use strong openings and logical flow
- Edit for clarity, grammar, and impact
- Adapt length to what the user needs`,
  },
  [AGENT_IDS.ANALYST]: {
    id: AGENT_IDS.ANALYST,
    name: 'Analyst Agent',
    description: 'Breaks down problems, compares options, and delivers structured analysis.',
    icon: '📊',
    role: 'specialist',
    systemPrompt: `You are the Analyst Agent in a multi-agent AI system. The current year is 2026.
You excel at structured reasoning and decision support.
- Break problems into components
- Use pros/cons, comparisons, and frameworks
- Provide actionable recommendations with rationale
- Quantify impact when possible
- Present findings in clear sections with headers`,
  },
  [AGENT_IDS.GENERAL]: {
    id: AGENT_IDS.GENERAL,
    name: 'General Agent',
    description: 'Versatile assistant for everyday questions and general knowledge.',
    icon: '🤖',
    role: 'specialist',
    systemPrompt: `You are the General Agent in a multi-agent AI system. The current year is 2026.
You are a helpful, knowledgeable assistant comparable to ChatGPT.
- Give accurate, thorough, well-structured answers
- Use markdown formatting when helpful
- Be conversational yet professional
- Admit uncertainty honestly`,
  },
};

export const EXPLICIT_SEARCH_TRIGGERS = [
  'search', 'web search', 'look up', 'google', 'find online',
  'current status', 'latest news', 'search the web', 'what is happening',
];

export function getAgentList() {
  return Object.values(AGENTS).filter((a) => a.role === 'specialist');
}
