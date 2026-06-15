import express from 'express';
// Adjust path if needed;
import authMiddleware from '../authmiddleware/authmiddleware.js';
import { getUserChatHistory, handleAgentChat, deleteUserChatSession, getSessionMessages } from '../controllar/ai.controllar.js';


const Airouter = express.Router();



// --- Secure Token authMiddlewareed Agent Pathways ---
// The 'protect' middleware ensures only verified accounts execute these routes
Airouter.post('/chat/agent', authMiddleware, handleAgentChat);
Airouter.get('/chat/history', authMiddleware, getUserChatHistory);
Airouter.get('/chat/messages/:sessionId', authMiddleware, getSessionMessages);
Airouter.delete('/chat/history/:sessionId', authMiddleware, deleteUserChatSession);

export default Airouter;


// Afsa1234