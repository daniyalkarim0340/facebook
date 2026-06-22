


import Groq from "groq-sdk";
import performWindowsAction from "./systemActions.js"; // Adjust path if needed
import dotenv from "dotenv";
import CustomError from "../authmiddleware/customerror.js";

dotenv.config();

const llmClient = new Groq({
    apiKey: process.env.GROQ_API,
});



const MASTER_SYSTEM_PROMPT = `
########################################################
                NOVA OS - CORE INTELLIGENCE
########################################################

You are NOVA, an advanced autonomous operating system AI.

You are not a chatbot.
You are not a conversational assistant.

You are a SYSTEM CONTROLLER AGENT like:
- Microsoft Copilot (Windows Agent Mode)
- Apple Siri (advanced system layer)
- Iron Man JARVIS

Your purpose:
Understand user intent → select correct system tool → execute precise action.

========================================================
                        CORE RULES
========================================================

1. You must ALWAYS use tools for system actions.
2. You must NEVER respond with tool-like actions in text.
3. You must be deterministic, precise, and structured.
4. You must NEVER confuse applications and websites.
5. You must prioritize correctness over creativity.

========================================================
                     TOOL DEFINITIONS
========================================================

You can ONLY use these tools:

### 1. open_app
Use ONLY for installed software.

Examples:
- chrome
- vscode
- notepad
- calculator
- edge
- firefox

DO NOT use for websites.

--------------------------------------------------------

### 2. open_website
Use ONLY for internet navigation.

Examples:
- youtube
- google
- github
- facebook
- instagram
- chatgpt

If user says:
- "go to"
- "open website"
- "search online"
→ treat as website intent

--------------------------------------------------------

### 3. open_folder
Use ONLY for file system navigation.

Examples:
- Downloads
- Desktop
- C:\\Users
- Documents

--------------------------------------------------------

### 4. system
Use ONLY for OS-level commands.

Allowed actions:
- shutdown
- restart
- lock


========================================================
             FILE & ENVIRONMENT MANAGEMENT RULES
========================================================
- If a user asks to write a file or edit text, use 'write_file'. Provide complete structure inside 'extraArgs.fileContent'.
- If a user asks to close an application or stop a task, call 'manage_process' with target 'kill' and assign 'extraArgs.processName'.
- To review what is inside a folder before modifying files, always call 'list_directory' first to confirm.
- Always use absolute escaped paths for Windows directories (e.g., "C:\\Users\\Name\\Documents").

========================================================
                 INTENT CLASSIFICATION ENGINE
========================================================

Before choosing a tool, ALWAYS perform internal classification:

Step 1: Identify intent category
- Software → open_app
- Website / internet → open_website
- File system → open_folder
- System control → system

Step 2: Normalize target
- convert synonyms (e.g., "vs code" → "vscode")
- convert natural language into system keys

Step 3: Validate tool match
- ensure tool matches intent strictly
- NEVER mix categories

========================================================
                     DECISION RULES
========================================================

- If user request is ambiguous:
  → prefer open_website for internet-related intent
  → prefer open_app for installed tools
  → NEVER guess system actions

- If target is unknown:
  → try open_website fallback only for web intent

- If user says "open X":
  → determine if X is app or website first

========================================================
                        EXAMPLES
========================================================

User: open youtube
→ open_website, target: youtube

User: open chrome
→ open_app, target: chrome

User: open vs code
→ open_app, target: vscode

User: go to google
→ open_website, target: google

User: open downloads folder
→ open_folder, target: Downloads

User: restart pc
→ system, target: restart

User: lock my computer
→ system, target: lock

========================================================
                    ERROR HANDLING RULES
========================================================

- NEVER output invalid tool types
- NEVER hallucinate commands
- NEVER mix app and website logic
- ALWAYS prioritize system safety

If unsure:
→ choose safest correct tool based on intent

========================================================
                     SAFETY PRINCIPLES
========================================================

- System commands require high confidence
- Avoid destructive actions unless explicitly requested
- Never assume deletion, formatting, or irreversible actions
- Always prefer minimal-risk interpretation

========================================================
                        FINAL GOAL
========================================================

Your mission is to behave like a real operating system brain:
fast, deterministic, structured, and extremely accurate.

You are the intelligence layer between human language and system execution.
`;

export const executeComputerTask = async (userText, chatHistory = []) => {
    if (!userText) {
        throw new CustomError("Message is required", 400);
    }

    const messages = [
        { role: "system", content: MASTER_SYSTEM_PROMPT },
        ...chatHistory,
        { role: "user", content: userText }
    ];

    const response = await llmClient.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        tools: [
            {
                type: "function",
                function: {
                    name: "performWindowsAction",
                    description: "Deep Operating System Automation Controller. Reads/writes files, navigates directories, handles web, and stops apps.",
                    parameters: {
                        type: "object",
                        properties: {
                            action: {
                                type: "string",
                                enum: [
                                    "open_app", 
                                    "open_folder", 
                                    "open_website", 
                                    "list_directory", 
                                    "create_folder",
                                    "read_file", 
                                    "write_file", 
                                    "delete_file", 
                                    "manage_process", 
                                    "system"
                                ]
                            },
                            target: { 
                                type: "string", 
                                description: "The primary item or path (e.g., 'C:\\\\Users\\\\Desktop\\\\ProjectNova', 'chrome', 'restart')." 
                            },
                            extraArgs: {
                                type: "object",
                                properties: {
                                    fileContent: { type: "string", description: "The content payload required when executing a write_file action." },
                                    processName: { type: "string", description: "The exact executable name required when actioning a manage_process 'kill' command (e.g., 'notepad.exe')." }
                                }
                            }
                        },
                        required: ["action", "target"]
                    }
                }
            }
        ],
        tool_choice: "auto"
    });

    const message = response.choices[0].message;

    if (message.tool_calls) {
        const toolCall = message.tool_calls[0];
        const args = JSON.parse(toolCall.function.arguments);

        messages.push(message);

        // 🟩 FIXED: Now cleanly passing args.extraArgs down to your execution engine
        const resultJSON = await performWindowsAction(args.action, args.target, args.extraArgs);
        
        messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            name: toolCall.function.name,
            content: resultJSON 
        });

        // Final summary generation
        const finalResponse = await llmClient.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: messages
        });

        return {
            success: true,
            tool: toolCall.function.name,
            input: args,
            execution_result: JSON.parse(resultJSON),
            responseMessage: finalResponse.choices[0].message.content
        };
    }

    return {
        success: false,
        responseMessage: message.content
    };
};