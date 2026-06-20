import express from "express";
import { handleUserMessage } from "../hyper/aiAssistant.js";


const AIrouter = express.Router();

AIrouter.post("/destop", async (req, res) => {
    const { message } = req.body;

    const result = await handleUserMessage(message);

    res.json(result);
});

export default AIrouter;