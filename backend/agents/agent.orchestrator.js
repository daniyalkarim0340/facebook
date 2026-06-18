import { routeToAgent } from './router.agent.js';
import { runResearchAgent, runSpecialistAgent } from './specialists/index.js';
import { optimizeSearchQuery, runWebSearch } from './tools/webSearch.tool.js';
import { AGENTS, AGENT_IDS, AVAILABLE_MODELS, DEFAULT_MODEL } from './agent.config.js';

/**
 * Multi-Agent Pipeline:
 * 1. Router Agent → classifies intent
 * 2. Research Agent (optional) → web search tool
 * 3. Specialist Agent → generates final response
 */
export async function runMultiAgentPipeline({
  message,
  history = [],
  model,
  forcedAgent = null,
  onStatus = null,
}) {
  const selectedModel = (model && AVAILABLE_MODELS[model]) ? model : DEFAULT_MODEL;
  const pipeline = [];

  // ── Step 1: Router Agent ──────────────────────────────────────
  onStatus?.('Router Agent: analyzing your request...');
  pipeline.push({ step: 1, agent: AGENT_IDS.ROUTER, status: 'completed' });

  const route = await routeToAgent(message, history, forcedAgent);

  // ── Step 2: Research (when needed) ────────────────────────────
  let researchContext = '';
  let sourceCount = 0;
  let searchQuery = null;

  const shouldSearch = route.needsSearch && route.primaryAgent !== AGENT_IDS.RESEARCH;

  if (route.primaryAgent === AGENT_IDS.RESEARCH || shouldSearch) {
    onStatus?.('Research Agent: searching the web...');
    pipeline.push({ step: 2, agent: AGENT_IDS.RESEARCH, status: 'running' });

    if (route.primaryAgent === AGENT_IDS.RESEARCH) {
      const result = await runResearchAgent({ message, history, model: selectedModel });
      pipeline[pipeline.length - 1].status = 'completed';

      return {
        response: result.response,
        primaryAgent: AGENT_IDS.RESEARCH,
        agentsPipeline: pipeline.map((p) => p.agent),
        toolExecuted: `Multi-Agent: ${AGENTS[AGENT_IDS.RESEARCH].name} + Tavily Web Search`,
        agentMeta: {
          route,
          searchQuery: result.searchQuery,
          sourceCount: result.sourceCount,
          model: selectedModel,
        },
      };
    }

    searchQuery = await optimizeSearchQuery(message, history);
    const search = await runWebSearch(searchQuery);
    researchContext = search.context;
    sourceCount = search.sourceCount;
    pipeline[pipeline.length - 1].status = 'completed';
  }

  // ── Step 3: Specialist Agent ──────────────────────────────────
  const specialist = AGENTS[route.primaryAgent] || AGENTS[AGENT_IDS.GENERAL];
  onStatus?.(`${specialist.name}: generating response...`);
  pipeline.push({ step: pipeline.length + 1, agent: route.primaryAgent, status: 'running' });

  const result = await runSpecialistAgent(route.primaryAgent, {
    message,
    history,
    model: selectedModel,
    researchContext,
  });

  pipeline[pipeline.length - 1].status = 'completed';

  const toolLabel = researchContext
    ? `Multi-Agent: ${specialist.name} + Research + Tavily`
    : `Multi-Agent: ${specialist.name}`;

  return {
    response: result.response,
    primaryAgent: route.primaryAgent,
    agentsPipeline: pipeline.map((p) => p.agent),
    toolExecuted: toolLabel,
    agentMeta: {
      route,
      searchQuery,
      sourceCount,
      model: selectedModel,
      secondaryAgents: route.secondaryAgents,
    },
  };
}
