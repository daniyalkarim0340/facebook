import { exec } from 'child_process';

// 1. Define the tool function directly here
function performWindowsAction(action, target) {
    let command = '';

    if (action === 'open_app') {
        const apps = {
            'chrome': 'start chrome',
            'notepad': 'start notepad',
            'calculator': 'calc'
        };
        command = apps[target.toLowerCase()];
        
    } else if (action === 'open_folder') {
        // Windows uses 'explorer' to open directories
        command = `explorer "${target}"`;
    }

    if (!command) {
        console.log(`Action or target not recognized: ${action} - ${target}`);
        return JSON.stringify({ success: false, error: "Command not mapped in the system." });
    }

    // Execute the command in the Windows terminal
    exec(command, (error) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
        } else {
            console.log(`Successfully ran: ${command}`);
        }
    });

    return JSON.stringify({ success: true, message: `Action executed for ${target}` });
}

// 2. Your core chatbot service function
async function handleUserMessage(userText) {
    try {
        // Send the user's message to the LLM, passing the tool definition
        const response = await llmClient.chat.completions.create({
            model: "llama3-70b-8192", 
            messages: [{ role: "user", content: userText }],
            tools: [
                {
                    type: "function",
                    function: {
                        name: "performWindowsAction",
                        description: "Opens a Windows application or specific folder.",
                        parameters: {
                            type: "object",
                            properties: {
                                action: { type: "string", enum: ["open_app", "open_folder"] },
                                target: { type: "string", description: "The app name like 'chrome' or folder path" }
                            },
                            required: ["action", "target"]
                        }
                    }
                }
            ],
            tool_choice: "auto"
        });

        const message = response.choices[0].message;

        // Check if the LLM decided it needs to use your tool
        if (message.tool_calls) {
            const toolCall = message.tool_calls[0];

            if (toolCall.function.name === "performWindowsAction") {
                // Parse the arguments the AI generated
                const args = JSON.parse(toolCall.function.arguments);
                
                // Run the local Windows command
                const toolResult = performWindowsAction(args.action, args.target);
                console.log("System Action Result:", toolResult);
            }
        } else {
            // Handle regular text responses
            console.log("AI says:", message.content);
        }
    } catch (error) {
        console.error("Error communicating with LLM:", error);
    }
}