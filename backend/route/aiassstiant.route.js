import express from "express";
import { handleUserMessage } from "../hyper/aiAssistant.js";


const AIrouter = express.Router();

AIrouter.post("/destop", async (req, res, next) => {
    try {
        const { message, history } = req.body; // history = [{role: "user", content: "..."}, {role: "assistant", content: "..."}]
        
        const result = await handleUserMessage(message, history || []);
        
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default AIrouter;