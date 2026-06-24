import { completeChat } from '../llm.provider.js';
import { AGENTS, AGENT_IDS } from '../agent.config.js';
import { optimizeSearchQuery, runWebSearch } from '../tools/webSearch.tool.js';
import { executeComputerTask } from '../../hyper/aiAssistant.js';

/**
 * Builds a structured, identity-infused message array for deep context reasoning
 */
function buildMessages(agentId, { message, history, researchContext, userName = 'Daniyal' }) {
  const agent = AGENTS[agentId] || AGENTS[AGENT_IDS.GENERAL];
  const contextBlock = researchContext
    ? `\n\n[WEB RESEARCH CONTEXT]\n${researchContext}\n[/WEB RESEARCH CONTEXT]`
    : '';

  return [
    {
      role: 'system',
      content: `${agent.systemPrompt || 'You are a helpful AI assistant.'}${contextBlock}

CRITICAL USER CONTEXT: You are communicating directly with your user, ${userName}. Address them by name when natural, professional, and contextually appropriate.
You are part of a multi-agent team. Do not expose internal technical agent names or pipeline mechanics to the user.
Deliver a clean, high-quality response directly.`,
    },
    ...history,
    { role: 'user', content: message },
  ];
}

/**
 * Research Synthesis Pipeline
 */
export async function runResearchAgent({ message, history, model, userName }) {
  const query = await optimizeSearchQuery(message, history);
  const search = await runWebSearch(query);

  const synthesis = await completeChat({
    model,
    temperature: 0.3,
    messages: buildMessages(AGENT_IDS.RESEARCH, {
      message,
      history,
      researchContext: search.context,
      userName,
    }),
  });

  return {
    response: synthesis,
    primaryAgent: AGENT_IDS.RESEARCH,
    agentsPipeline: [AGENT_IDS.ROUTER, AGENT_IDS.RESEARCH],
    toolExecuted: `Multi-Agent: Research Agent + Web Search`,
    agentMeta: { searchQuery: query, sourceCount: search.sourceCount, model },
  };
}

/**
 * Computer Agent OS Pipeline Fallback Engine
 */
export async function runComputerAgent({ message, history, model }) {
  const computerResult = await executeComputerTask(message, history, model);
  const finalResponse = computerResult.responseMessage || computerResult.message || 'System command completed successfully.';

  return {
    response: finalResponse, 
    primaryAgent: AGENT_IDS.COMPUTER,
    agentsPipeline: [AGENT_IDS.ROUTER, AGENT_IDS.COMPUTER],
    toolExecuted: computerResult.success ? `NOVA OS Tool: ${computerResult.input?.action || 'System'}` : 'None', 
    agentMeta: { executionResult: computerResult.execution_result || null, model }
  };
}

/**
 * Master Specialist Matrix Factory
 */
export async function runSpecialistAgent(agentId, { message, history, model, researchContext, userName }) {
  if (agentId === AGENT_IDS.RESEARCH) {
    return runResearchAgent({ message, history, model, userName });
  }

  if (agentId === AGENT_IDS.COMPUTER) {
    return runComputerAgent({ message, history, model });
  }

  const specialist = AGENTS[agentId] || AGENTS[AGENT_IDS.GENERAL];
  const targetTemperature = agentId === AGENT_IDS.CODE ? 0.1 : 0.7;

  const response = await completeChat({
    model,
    temperature: targetTemperature,
    messages: buildMessages(agentId, { message, history, researchContext, userName }),
  });

  const toolLabel = researchContext
    ? `Multi-Agent: ${specialist.name} + Research`
    : `Multi-Agent: ${specialist.name}`;
    // Inside specialists/index.js -> runSpecialistAgent
console.log("🚀 PAYLOAD BEING SENT TO LLM:", JSON.stringify(buildMessages(agentId, { message, history, researchContext, userName }), null, 2));

  return {
    response,
    primaryAgent: agentId,
    agentsPipeline: researchContext ? [AGENT_IDS.ROUTER, AGENT_IDS.RESEARCH, agentId] : [AGENT_IDS.ROUTER, agentId],
    toolExecuted: toolLabel,
    agentMeta: { researchContext: researchContext || null, model },
  };
}