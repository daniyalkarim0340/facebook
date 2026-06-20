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
        // 1. Send request to the AI model
        // We define the 'tools' so the AI knows it has permission to call performWindowsAction
        const response = await llmClient.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { 
                    role: "system", 
                    content: "You are a desktop assistant. If the user asks to open an app/folder, use the 'performWindowsAction' tool." 
                },
                { role: "user", content: userText }
            ],
            tools: [{
                type: "function",
                function: {
                    name: "performWindowsAction",
                    description: "Opens a Windows application or folder.",
                    parameters: {
                        type: "object",
                        properties: {
                            action: { type: "string", enum: ["open_app", "open_folder"] },
                            target: { type: "string" }
                        },
                        required: ["action", "target"]
                    }
                }
            }],
            tool_choice: "auto" // AI decides automatically whether to just talk or use a tool
        });

        // 2. Extract the AI's message from the response
        const message = response.choices[0].message;

        // 3. Check if the AI wants to use a tool
        if (message.tool_calls) {
            // Parse the arguments (action/target) the AI decided on
            const args = JSON.parse(message.tool_calls[0].function.arguments);
            
            // Execute the system action using the imported function
            const result = performWindowsAction(args.action, args.target);
            
            // Log the result of the tool execution
            console.log("System Result:", result);
        } else {
            // 4. Handle standard chat (if no tool was called)
            console.log("AI says:", message.content);
        }
    } catch (error) {
        // Error handling if the API call or tool execution fails
        console.error("Error in AI Assistant:", error);
    }
}