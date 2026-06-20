import { exec } from 'child_process';
import readline from 'readline';
import dotenv from 'dotenv';
import Groq from 'groq-sdk'; // 1. Import Groq
dotenv.config();
// 2. Initialize the client
// It's best to use environment variables, but you can paste your key directly for quick local testing.
const llmClient = new Groq({
    apiKey: process.env.GROQ_API_K || "YOUR_GROQ_API_KEY_HERE" 
});
// 1. Define the tool function directly here

//   This function acts as the bridge between the AI's "intent"
//  * and your Windows computer's "actions".
//  */
function performWindowsAction(action, target) {
    // 1. Initialize an empty variable to hold the final terminal command
    let command = '';

    // 2. Check what kind of action the AI requested
    if (action === 'open_app') {
        // Create a list of allowed apps and their corresponding Windows commands
        const apps = {
            'chrome': 'start chrome',
            'notepad': 'start notepad',
            'calculator': 'calc'
        };
        // Look up the command based on the target (e.g., 'chrome')
        command = apps[target.toLowerCase()];
        
    } else if (action === 'open_folder') {
        // Build the command to open a specific folder using Windows explorer
        // Quotes are used around target to handle folder names with spaces
        command = `explorer "${target}"`;
    }

    // 3. Safety check: If the AI requested something we didn't map above, exit early
    if (!command) {
        console.log(`Action or target not recognized: ${action} - ${target}`);
        // Return a JSON string so the AI can understand that the task failed
        return JSON.stringify({ success: false, error: "Command not mapped in the system." });
    }

    // 4. Execution phase: Tell Windows to run the command
    // exec() runs the command in a hidden background terminal
    exec(command, (error) => {
        if (error) {
            // If Windows fails to open the app, log the error for debugging
            console.error(`Execution error: ${error.message}`);
        } else {
            // If it succeeds, log the confirmation
            console.log(`Successfully ran: ${command}`);
        }
    });

    // 5. Final report: Tell the AI the action was triggered successfully
    return JSON.stringify({ success: true, message: `Action executed for ${target}` });
}

// 2. Your core chatbot service function
async function handleUserMessage(userText) {
    try {
        // 1. Communicate with the AI:
        // We send the user's text and provide a list of 'tools' the AI can use.
        // We also describe those tools so the AI knows when and how to call them.
        const response = await llmClient.chat.completions.create({
            model: "llama-3.3-70b-versatile", 
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
                                // Define the expected arguments so the AI provides valid data
                                action: { type: "string", enum: ["open_app", "open_folder"] },
                                target: { type: "string", description: "The app name like 'chrome' or folder path" }
                            },
                            required: ["action", "target"]
                        }
                    }
                }
            ],
            tool_choice: "auto" // Let the AI decide if it needs to use a tool or just talk
        });

        // 2. Capture the AI's response:
        const message = response.choices[0].message;

        // 3. Inspect for tool calls:
        // The AI doesn't always use a tool; we check if it specifically requested one.
        if (message.tool_calls) {
            const toolCall = message.tool_calls[0];

            // 4. Validate the function name:
            // Ensure the AI is asking for the tool we actually built.
            if (toolCall.function.name === "performWindowsAction") {
                
                // 5. Extract and parse arguments:
                // The AI returns the arguments as a JSON string; we convert that back to a JS object.
                const args = JSON.parse(toolCall.function.arguments);
                
                // 6. Execute the local action:
                // Call the function we defined earlier to actually trigger the Windows command.
                const toolResult = performWindowsAction(args.action, args.target);
                console.log("System Action Result:", toolResult);
            }
        } else {
            // 7. Handle natural language:
            // If the AI didn't need a tool, just print the text response back to you.
            console.log("AI says:", message.content);
        }
    } catch (error) {
        // 8. Catch errors:
        // If the internet goes down or the API key fails, this prevents the whole bot from crashing.
        console.error("Error communicating with LLM:", error);
    }
}
// 1. Create the interface:
// This links your script to the Windows Terminal (stdin = keyboard input, stdout = terminal text)
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 2. Define the main conversation loop:
function startChat() {
    // 3. Ask a question:
    // This displays "You: " in the terminal and waits for you to type and hit Enter.
    rl.question('You: ', async (userInput) => {
        
        // 4. Check for exit command:
        // This is a simple logic check to allow you to stop the program gracefully.
        if (userInput.toLowerCase() === 'exit') {
            console.log("Goodbye!");
            rl.close(); // Closes the connection to the terminal
            return;     // Stops the function so it doesn't loop again
        }

        // 5. Connect to the AI:
        // This calls your 'handleUserMessage' function defined earlier, 
        // passing whatever you typed to the AI model.
        await handleUserMessage(userInput);
        
        // 6. Recursion (The Loop):
        // This is the most important part. By calling 'startChat()' again at the end, 
        // the program restarts itself, creating an infinite loop that keeps the 
        // chatbot running until you type 'exit'.
        startChat(); 
    });
}

// 7. Initial startup:
console.log("🤖 Chatbot is ready! Tell me to open an app, or type 'exit' to quit.");
startChat(); // Kicks off the very first conversation loop