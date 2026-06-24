import { routeToAgent } from './router.agent.js';
import { runSpecialistAgent } from './specialists/index.js';
import { optimizeSearchQuery, runWebSearch } from './tools/webSearch.tool.js';
import { AGENTS, AGENT_IDS, AVAILABLE_MODELS, DEFAULT_MODEL } from './agent.config.js';
import { executeImageGeneration } from '../controllar/image.controllar.js';
import { executeComputerTask } from '../hyper/aiAssistant.js';

export async function runMultiAgentPipeline({
  message,
  history = [],
  model,
  forcedAgent = null,
  onStatus = null,
  userName = 'Daniyal', // 🚀 Accepted with a clean default fallback
}) {
  const selectedModel = (model && AVAILABLE_MODELS[model]) ? model : DEFAULT_MODEL;
  const cleanMessage = message.toLowerCase().trim();
  const pipeline = [];

  // ── Step 1: Router Agent ──────────────────────────────────────
  onStatus?.('Router Agent: analyzing your request...');
  pipeline.push({ step: 1, agent: AGENT_IDS.ROUTER, status: 'completed' });

  const route = await routeToAgent(message, history, forcedAgent);

  // ── 🛡️ Identity Query Guardrail ──────────────────────────────
  // Intercepts personal/identity questions early to avoid context pollution from web search (RAG)
  const identityTriggers = [
    'what is my name', 
    'what s my nmae', 
    'whats my name', 
    'who am i', 
    'tell me my name', 
    'my name'
  ];
  
  const isIdentityQuery = identityTriggers.some(trigger => cleanMessage.includes(trigger)) || 
                          /\b(who\s*am\s*i|what\s*is\s*my\s*name)\b/i.test(cleanMessage);

  if (isIdentityQuery) {
    route.needsSearch = false;
    route.primaryAgent = AGENT_IDS.GENERAL;
  }

  // ── 💻 Computer Agent Interception ──────────────────────
  const computerTriggers = [
    'open', 'start', 'launch', 'run', 'execute', 'boot', 'bring up',
    'close', 'kill', 'stop', 'terminate', 'end task', 'force quit', 'exit', 'quit',
    'go to', 'open website', 'browse', 'navigate to', 'visit', 'search for', 'look up', 'google',
    'make', 'create', 'build', 'spawn', 'new folder', 'new file', 'generate file', 'generate folder',
    'write', 'save', 'update', 'append', 'edit', 'modify', 'change content',
    'delete', 'remove', 'trash', 'wipe', 'clear', 'erase', 'destroy',
    'read', 'view', 'show', 'display', 'list', 'show files', 'look inside', 'check folder', 'directory', 'dir',
    'restart', 'reboot', 'shutdown', 'turn off', 'power off', 'lock', 'sleep', 'hibernate', 'log out', 'sign out',
    'tasklist', 'active tasks', 'running apps', 'processes'
  ];

  const isComputerRequest = route.primaryAgent === AGENT_IDS.COMPUTER || 
                            computerTriggers.some(word => cleanMessage.includes(word));
  
  if (isComputerRequest) {
    onStatus?.('Computer Agent: Executing system action...');
    pipeline.push({ step: 2, agent: AGENT_IDS.COMPUTER, status: 'running' });

    try {
      const computerResult = await executeComputerTask(message, history);
      pipeline[pipeline.length - 1].status = 'completed';

      return {
        response: computerResult.responseMessage || computerResult.message,
        primaryAgent: AGENT_IDS.COMPUTER,
        agentsPipeline: pipeline.map((p) => p.agent),
        toolExecuted: computerResult.success ? `NOVA OS Tool: ${computerResult.input?.action || 'System'}` : 'None',
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
      route.primaryAgent = AGENT_IDS.GENERAL; 
    }
  }

  // ── 🟩 Image Generation Interception ──────────────────────────
  const imageTriggerWords = ['generate an image', 'generate image', 'make an image', 'draw an image', 'create an image'];
  const isImageRequest = route.primaryAgent === AGENT_IDS.IMAGE || 
                         imageTriggerWords.some(word => cleanMessage.includes(word));

  if (isImageRequest) {
    onStatus?.('Image Agent: generating your visual asset...');
    pipeline.push({ step: 2, agent: AGENT_IDS.IMAGE, status: 'running' });

    try {
      let cleanPrompt = message;
      imageTriggerWords.forEach(word => {
        cleanPrompt = cleanPrompt.replace(new RegExp(word, 'gi'), '');
      });
      cleanPrompt = cleanPrompt.replace(/^(?:of|for|about)\s+/i, '').trim();

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
      route.primaryAgent = AGENT_IDS.GENERAL;
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
      const result = await runSpecialistAgent(AGENT_IDS.RESEARCH, { 
        message, history, model: selectedModel, researchContext: '', userName 
      });
      pipeline[pipeline.length - 1].status = 'completed';
      return result;
    }

    searchQuery = await optimizeSearchQuery(message, history);
    const search = await runWebSearch(searchQuery);
    researchContext = search.context;
    sourceCount = search.sourceCount;
    pipeline[pipeline.length - 1].status = 'completed';
  }

  // ── Step 3: Specialist Agent Execution ─────────────────────────
  const specialist = AGENTS[route.primaryAgent] || AGENTS[AGENT_IDS.GENERAL];
  onStatus?.(`${specialist.name}: generating response...`);
  pipeline.push({ step: pipeline.length + 1, agent: route.primaryAgent, status: 'running' });

  const result = await runSpecialistAgent(route.primaryAgent, {
    message, history, model: selectedModel, researchContext, userName,
  });

  pipeline[pipeline.length - 1].status = 'completed';

  return result;
}