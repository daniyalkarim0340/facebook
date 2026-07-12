import { runMultiAgentPipeline } from '../agents/agent.orchestrator.js';
import { AGENT_IDS } from '../agents/agent.config.js';

export const handleVoiceChat = async (req, res) => {
    const { transcribedText } = req.body;

    if (!transcribedText) {
        return res.status(400).json({ error: "transcribedText is required" });
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const result = await runMultiAgentPipeline({
            message: transcribedText,
            forcedAgent: AGENT_IDS.VOICE,
            userName: 'Voice User',
        });

        const responseText = typeof result.response === 'string'
            ? result.response
            : JSON.stringify(result.response);

        res.write(responseText);
        res.end();
    } catch (error) {
        console.error("Voice agent pipeline failed:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to generate voice agent response" });
        } else {
            res.end();
        }
    }
};