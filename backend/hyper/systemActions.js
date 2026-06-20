import { exec } from 'child_process';

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
