import { ChatSession } from '../model/ai.model.js';
import asyncHandler from 'express-async-handler';
import CustomError from '../handler/customerror.js';
import { runMultiAgentPipeline } from '../agents/agent.orchestrator.js';
import { getAgentList, AVAILABLE_MODELS, AGENTS, AGENT_IDS } from '../agents/agent.config.js';

export const handleAgentChat = asyncHandler(async (req, res, next) => {
  const { message, sessionId, model, agent } = req.body;
  const userId = req.user._id;
  
  // Extract your identity name from the request context with a clean fallback
  const userName = req.user.name || 'Daniyal'; 

  if (!message?.trim()) {
    return next(new CustomError('A message content prompt is required.', 400));
  }

  // 1. Fetch or initialize the session
  let session;
  if (sessionId) {
    session = await ChatSession.findOne({ _id: sessionId, userId });
    if (!session) {
      return next(new CustomError('No active conversation thread found matching that ID.', 404));
    }
  } else {
    session = await ChatSession.create({ userId, messages: [] });
  }

  // 2. Compile sliding window memory context BEFORE committing the new turn
  const history = session.messages.slice(-24).map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  // Early-commit the user message intent immediately to guarantee data persistence
  session.messages.push({ role: 'user', content: message.trim() });
  
  if (session.messages.length === 1) {
    session.title = message.trim().length > 40 ? `${message.trim().substring(0, 40)}...` : message.trim();
  }
  await session.save();

  // 3. Execute the heavy AI Multi-Agent pipeline
  let result;
  try {
    result = await runMultiAgentPipeline({
      message: message.trim(),
      history,
      model,
      forcedAgent: agent || null,
      userName, // 🚀 Passed down into the orchestrator core
    });
  } catch (pipelineError) {
    session.messages.push({
      role: 'system',
      content: 'The agent pipeline encountered an execution error processing this turn.',
      agentUsed: 'SystemGuardrail',
    });
    await session.save();
    return next(new CustomError(`Agent Pipeline Error: ${pipelineError.message}`, 502));
  }

  const agentInfo = AGENTS[result.primaryAgent];
  const modelName = AVAILABLE_MODELS[result.agentMeta?.model]?.name || model;

  // 4. Push the structural assistant response payload right into MongoDB
  session.messages.push({
    role: 'assistant',
    content: result.response,
    isImage: result.isImage || false, 
    toolUsed: result.toolExecuted || 'None',
    agentUsed: result.primaryAgent,
    agentsPipeline: result.agentsPipeline || [],
    model: result.agentMeta?.model,
  });

  await session.save();

  // 5. Return high-density tracing metadata directly to your frontend UI
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