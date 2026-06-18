import { ChatSession } from '../model/ai.model.js';
import asyncHandler from 'express-async-handler';
import CustomError from '../handler/customerror.js';
import { runMultiAgentPipeline } from '../agents/agent.orchestrator.js';
import { getAgentList, AVAILABLE_MODELS, AGENTS, AGENT_IDS } from '../agents/agent.config.js';

// ----------------------------------------------------
// MULTI-AGENT CHAT HANDLER
// ----------------------------------------------------
export const handleAgentChat = asyncHandler(async (req, res, next) => {
  const { message, sessionId, model, agent } = req.body;
  const userId = req.user._id;

  if (!message?.trim()) {
    return next(new CustomError('A message content prompt is required.', 400));
  }

  let session;
  if (sessionId) {
    session = await ChatSession.findOne({ _id: sessionId, userId });
    if (!session) {
      return next(new CustomError('No active conversation thread found matching that ID.', 404));
    }
  } else {
    session = await ChatSession.create({ userId, messages: [] });
  }

  const history = session.messages.slice(-24).map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const result = await runMultiAgentPipeline({
    message: message.trim(),
    history,
    model,
    forcedAgent: agent || null,
  });

  const agentInfo = AGENTS[result.primaryAgent];
  const modelName = AVAILABLE_MODELS[result.agentMeta?.model]?.name || model;

  session.messages.push({ role: 'user', content: message.trim() });
  session.messages.push({
    role: 'assistant',
    content: result.response,
    toolUsed: result.toolExecuted,
    agentUsed: result.primaryAgent,
    agentsPipeline: result.agentsPipeline,
    model: result.agentMeta?.model,
  });

  if (session.messages.length <= 2) {
    session.title = message.length > 30 ? `${message.substring(0, 30)}...` : message;
  }
  await session.save();

  res.status(200).json({
    status: 'success',
    sessionId: session._id,
    title: session.title,
    data: {
      response: result.response,
      toolExecuted: result.toolExecuted,
      agentUsed: result.primaryAgent,
      agentName: agentInfo?.name || 'General Agent',
      agentIcon: agentInfo?.icon || '🤖',
      agentsPipeline: result.agentsPipeline,
      modelUsed: modelName,
      agentMeta: result.agentMeta,
    },
  });
});

// ----------------------------------------------------
// LIST AVAILABLE AGENTS
// ----------------------------------------------------
export const getAvailableAgents = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      agents: getAgentList(),
      orchestrator: {
        name: AGENTS[AGENT_IDS.ROUTER].name,
        description: AGENTS[AGENT_IDS.ROUTER].description,
      },
    },
  });
});

// ----------------------------------------------------
// SESSION & HISTORY ROUTES
// ----------------------------------------------------
export const getSessionMessages = asyncHandler(async (req, res, next) => {
  const { sessionId } = req.params;
  const userId = req.user._id;
  if (!sessionId) return next(new CustomError('Session ID is required.', 400));

  const session = await ChatSession.findOne({ _id: sessionId, userId });
  if (!session) return next(new CustomError('No conversation thread found matching that ID.', 404));

  res.status(200).json({
    status: 'success',
    sessionId: session._id,
    title: session.title,
    data: { messages: session.messages },
  });
});

export const getUserChatHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const historySummary = await ChatSession.find({ userId })
    .select('title createdAt updatedAt')
    .sort({ updatedAt: -1 });

  res.status(200).json({
    status: 'success',
    results: historySummary.length,
    data: { history: historySummary },
  });
});

export const deleteUserChatSession = asyncHandler(async (req, res, next) => {
  const { sessionId } = req.params;
  const userId = req.user._id;
  if (!sessionId) return next(new CustomError('A valid sessionId parameter must be provided.', 400));

  const sessionToDelete = await ChatSession.findOneAndDelete({ _id: sessionId, userId });
  if (!sessionToDelete) {
    return next(new CustomError('No conversation thread found matching that ID for this user.', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Conversation thread deleted successfully.',
  });
});
