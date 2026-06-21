import { completeChat } from '../llm.provider.js';
import { AGENTS, AGENT_IDS } from '../agent.config.js';
import { optimizeSearchQuery, runWebSearch } from '../tools/webSearch.tool.js';
import { executeComputerTask } from '../../hyper/aiAssistant.js';

// 🟩 FIXED: Import your computer task controller execution logic
// (Adjust this relative path if your files are structured differently)


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

export async function runComputerAgent({ message, history, model }) {
  // 🟩 FIXED: Pass parameters individually without the wrapping object curly braces
  const computerResult = await executeComputerTask(message, history, model);

  return {
    response: computerResult.message, 
    agentId: AGENT_IDS.COMPUTER,
    isComputerAction: true,           
    toolExecuted: computerResult.tool, 
    executionResult: computerResult.execution_result 
  };
}
export async function runSpecialistAgent(agentId, { message, history, model, researchContext }) {
  // Branch 1: Research Agent Web Pipeline
  if (agentId === AGENT_IDS.RESEARCH) {
    return runResearchAgent({ message, history, model });
  }

  // 🟩 Branch 2: FIXED - Computer Agent Operating System Pipeline
  if (agentId === AGENT_IDS.COMPUTER) {
    return runComputerAgent({ message, history, model });
  }

  // Branch 3: Standard Chat Specialists (Code, Writer, Analyst, General)
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