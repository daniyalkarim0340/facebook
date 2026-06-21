import express from "express";
import { runMultiAgentPipeline } from "../agents/agent.orchestrator.js";
const AIrouter = express.Router();

AIrouter.post("/desktop", async (req, res, next) => {
    try {
        const { message, history, model, forcedAgent } = req.body; 
        
        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }

        const onStatus = (statusUpdate) => {
            console.log(`[Pipeline]: ${statusUpdate}`);
        };

        const result = await runMultiAgentPipeline({
            message,
            history: history || [],
            model,               
            forcedAgent,         
            onStatus
        });
        
        res.json(result);
    } catch (error) {
        console.error("Multi-Agent Pipeline Error:", error);
        next(error);
    }
});

export default AIrouter;