import Groq from 'groq-sdk';
import { performWindowsAction } from './tools.js'; // Imports the helper functions that talk to your OS
import 'dotenv/config'; // Loads your API key from the .env file

// Initialize the Groq client with your API Key
const llmClient = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Sends a message to the AI and handles the logic for 
 * either chatting or triggering a system tool.
 */
export async function handleUserMessage(userText) {
    try {
        const response = await llmClient.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a desktop assistant. Use tools when needed."
                },
                { role: "user", content: userText }
            ],
            tools: [{
                type: "function",
                function: {
                    name: "performWindowsAction",
                    description: "Open apps or folders",
                    parameters: {
                        type: "object",
                        properties: {
                            action: {
                                type: "string",
                                enum: ["open_app", "open_folder"]
                            },
                            target: { type: "string" }
                        },
                        required: ["action", "target"]
                    }
                }
            }],
            tool_choice: "auto"
        });

        const message = response.choices[0].message;

        // TOOL CALL
        if (message.tool_calls) {
            const args = JSON.parse(message.tool_calls[0].function.arguments);

        const result = performWindowsAction(args.action, args.target);

let parsedResult;
try {
    parsedResult = JSON.parse(result);
} catch (e) {
    parsedResult = { success: true, raw: result };
}

return {
    type: "tool",
    tool: "performWindowsAction",
    input: args,
    result: parsedResult
};
        }

        // NORMAL CHAT
        return {
            type: "chat",
            message: message.content
        };

    } catch (error) {
        return {
            type: "error",
            message: error.message
        };
    }
}