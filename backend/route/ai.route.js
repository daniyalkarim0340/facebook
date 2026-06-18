import express from 'express';
import authMiddleware from '../authmiddleware/authmiddleware.js';
import {
  getUserChatHistory,
  handleAgentChat,
  deleteUserChatSession,
  getSessionMessages,
  getAvailableAgents,
} from '../controllar/ai.controllar.js';

const Airouter = express.Router();

Airouter.get('/agents', authMiddleware, getAvailableAgents);
Airouter.post('/chat/agent', authMiddleware, handleAgentChat);
Airouter.get('/chat/history', authMiddleware, getUserChatHistory);
Airouter.get('/chat/messages/:sessionId', authMiddleware, getSessionMessages);
Airouter.delete('/chat/history/:sessionId', authMiddleware, deleteUserChatSession);

export default Airouter;
