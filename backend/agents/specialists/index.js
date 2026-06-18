import { completeChat } from '../llm.provider.js';
import { AGENTS, AGENT_IDS } from '../agent.config.js';
import { optimizeSearchQuery, runWebSearch } from '../tools/webSearch.tool.js';

function buildMessages(agentId, { message, history, researchContext }) {
  const agent = AGENTS[agentId];
  const contextBlock = researchContext
    ? `\n\n[WEB RESEARCH CONTEXT]\n${researchContext}\n[/WEB RESEARCH CONTEXT]`
    : '';

  return [
    {
      role: 'system',
      content: `${agent.systemPrompt}${contextBlock}

You are part of a multi-agent team. Do not mention other agents or internal routing.
Deliver a complete, high-quality answer directly to the user.`,
    },
    ...history,
    { role: 'user', content: message },
  ];
}

export async function runResearchAgent({ message, history, model }) {
  const query = await optimizeSearchQuery(message, history);
  const search = await runWebSearch(query);

  const synthesis = await completeChat({
    model,
    temperature: 0.6,
    messages: buildMessages(AGENT_IDS.RESEARCH, {
      message,
      history,
      researchContext: search.context,
    }),
  });

  return {
    response: synthesis,
    agentId: AGENT_IDS.RESEARCH,
    searchQuery: query,
    sourceCount: search.sourceCount,
    researchContext: search.context,
  };
}

export async function runSpecialistAgent(agentId, { message, history, model, researchContext }) {
  if (agentId === AGENT_IDS.RESEARCH) {
    return runResearchAgent({ message, history, model });
  }

  const response = await completeChat({
    model,
    temperature: 0.7,
    messages: buildMessages(agentId, { message, history, researchContext }),
  });

  return {
    response,
    agentId,
    researchContext: researchContext || null,
  };
}
