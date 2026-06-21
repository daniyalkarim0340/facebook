import { routeToAgent } from './router.agent.js';
import { runResearchAgent, runSpecialistAgent } from './specialists/index.js';
import { optimizeSearchQuery, runWebSearch } from './tools/webSearch.tool.js';
import { AGENTS, AGENT_IDS, AVAILABLE_MODELS, DEFAULT_MODEL } from './agent.config.js';
import { executeImageGeneration } from '../controllar/image.controllar.js';
import { executeComputerTask } from '../hyper/aiAssistant.js';
 // 👈 Import new controller

/**
 * Multi-Agent Pipeline
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

  // ── 💻 NEW: Computer Agent Interception ──────────────────────
  // Trigger words to ensure OS commands bypass normal chat
 const computerTriggers = [
  // ── APP MANIPULATION ──
  'open', 'start', 'launch', 'run', 'execute', 'boot', 'bring up',
  'close', 'kill', 'stop', 'terminate', 'end task', 'force quit', 'exit', 'quit',

  // ── WEB & INTERNET ──
  'go to', 'open website', 'browse', 'navigate to', 'visit', 'search for', 'look up', 'google',

  // ── FILE & FOLDER OPERATIONS ──
  'make', 'create', 'build', 'spawn', 'new folder', 'new file', 'generate file', 'generate folder',
  'write', 'save', 'update', 'append', 'edit', 'modify', 'change content',
  'delete', 'remove', 'trash', 'wipe', 'clear', 'erase', 'destroy',
  'read', 'view', 'show', 'display', 'list', 'show files', 'look inside', 'check folder', 'directory', 'dir',

  // ── OS PROCESS & POWER CONTROLS ──
  'restart', 'reboot', 'shutdown', 'turn off', 'power off', 'lock', 'sleep', 'hibernate', 'log out', 'sign out',
  'tasklist', 'active tasks', 'running apps', 'processes'
];
const isComputerRequest = route.primaryAgent === AGENT_IDS.COMPUTER || 
                            computerTriggers.some(word => message.toLowerCase().startsWith(word));

  if (isComputerRequest) {
    onStatus?.('Computer Agent: Executing system action...');
    pipeline.push({ step: 2, agent: AGENT_IDS.COMPUTER, status: 'running' });

    try {
      const computerResult = await executeComputerTask(message, history);
      pipeline[pipeline.length - 1].status = 'completed';

      return {
        response: computerResult.responseMessage,
        primaryAgent: AGENT_IDS.COMPUTER,
        agentsPipeline: pipeline.map((p) => p.agent),
        toolExecuted: computerResult.success ? `NOVA OS Tool: ${computerResult.input.action}` : 'None',
        isComputerAction: true,
        agentMeta: {
          route,
          actionDetails: computerResult.input,
          executionResult: computerResult.execution_result,
          model: 'llama-3.3-70b-versatile',
        },
      };
    } catch (error) {
      console.error("Computer Pipeline interception failed:", error);
      pipeline[pipeline.length - 1].status = 'failed';
      // If it fails, let it fall through to a normal specialist agent response
    }
  }

  // ── 🟩 Image Generation Interception ──────────────────────────
  const imageTriggerWords = ['generate an image', 'generate image', 'make an image', 'draw an image', 'create an image'];
  const isImageRequest = route.primaryAgent === AGENT_IDS.IMAGE || 
                         imageTriggerWords.some(word => message.toLowerCase().includes(word));

  if (isImageRequest) {
    onStatus?.('Image Agent: generating your visual asset...');
    pipeline.push({ step: 2, agent: AGENT_IDS.IMAGE, status: 'running' });

    try {
      let cleanPrompt = message;
      imageTriggerWords.forEach(word => {
        cleanPrompt = cleanPrompt.replace(new RegExp(word, 'gi'), '');
      });
      cleanPrompt = cleanPrompt.replace(/for/i, '').trim();

      const imageUrl = await executeImageGeneration(cleanPrompt || message);
      pipeline[pipeline.length - 1].status = 'completed';

      return {
        response: imageUrl, 
        primaryAgent: AGENT_IDS.IMAGE,
        agentsPipeline: pipeline.map((p) => p.agent),
        toolExecuted: 'Pollinations FLUX Engine',
        isImage: true, 
        agentMeta: { route, model: 'flux-pollinations' },
      };
    } catch (error) {
      console.error("Image Pipeline interception failed:", error);
      pipeline[pipeline.length - 1].status = 'failed';
    }
  }

  // ── Step 2: Research (when needed) ────────────────────────────
  let researchContext = '';
  let sourceCount = 0;
  let searchQuery = null;
  const shouldSearch = route.needsSearch && route.primaryAgent !== AGENT_IDS.RESEARCH;

  if (route.primaryAgent === AGENT_IDS.RESEARCH || shouldSearch) {
    onStatus?.('Research Agent: searching the web...');
    pipeline.push({ step: pipeline.length + 1, agent: AGENT_IDS.RESEARCH, status: 'running' });

    if (route.primaryAgent === AGENT_IDS.RESEARCH) {
      const result = await runResearchAgent({ message, history, model: selectedModel });
      pipeline[pipeline.length - 1].status = 'completed';

      return {
        response: result.response,
        primaryAgent: AGENT_IDS.RESEARCH,
        agentsPipeline: pipeline.map((p) => p.agent),
        toolExecuted: `Multi-Agent: ${AGENTS[AGENT_IDS.RESEARCH].name} + Web Search`,
        agentMeta: { route, searchQuery: result.searchQuery, sourceCount: result.sourceCount, model: selectedModel },
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
    message, history, model: selectedModel, researchContext,
  });

  pipeline[pipeline.length - 1].status = 'completed';

  const toolLabel = researchContext
    ? `Multi-Agent: ${specialist.name} + Research`
    : `Multi-Agent: ${specialist.name}`;

  return {
    response: result.response,
    primaryAgent: route.primaryAgent,
    agentsPipeline: pipeline.map((p) => p.agent),
    toolExecuted: toolLabel,
    agentMeta: { route, searchQuery, sourceCount, model: selectedModel, secondaryAgents: route.secondaryAgents },
  };
}