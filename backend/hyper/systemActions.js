import { exec } from "child_process";
import { promisify } from "util"; // 1. Import promisify

// 2. Convert callback-based exec into a Promise
const execPromise = promisify(exec); 

// 3. Make the function async
export default async function performWindowsAction(action, target) {
    let command = "";

    const apps = {
        chrome: "start chrome",
        edge: "start msedge",
        firefox: "start firefox",
        notepad: "start notepad",
        calculator: "calc",
        vscode: "code",
        explorer: "explorer",
        paint: "mspaint",
        cmd: "cmd",
        powershell: "powershell"
    };

    const websites = {
        youtube: "https://www.youtube.com",
        google: "https://www.google.com",
        chatgpt: "https://chat.openai.com",
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
        github: "https://github.com",
        gmail: "https://mail.google.com"
    };

    const key = (target || "").toLowerCase();

    // ========================
    // 🧠 SYSTEM ACTIONS
    // ========================
    if (action === "system") {
        if (key === "shutdown") {
            command = "shutdown /s /t 0";
        } else if (key === "restart") {
            command = "shutdown /r /t 0";
        } else if (key === "lock") {
            command = "rundll32.exe user32.dll,LockWorkStation";
        }
    }

    // ========================
    // 💻 OPEN APP
    // ========================
    else if (action === "open_app") {
        command = apps[key];
    }

    // ========================
    // 🌐 OPEN WEBSITE
    // ========================
    else if (action === "open_website") {
        const url = websites[key] || `https://www.${key}.com`;
        command = `start ${url}`;
    }

    // ========================
    // 📁 OPEN FOLDER
    // ========================
    else if (action === "open_folder") {
        command = `explorer "${target}"`;
    }

    // ========================
    // 🧠 ULTRA SMART FALLBACK
    // ========================
    if (!command) {
        if (action === "open_app" && websites[key]) {
            command = `start ${websites[key]}`;
        }
        else if (action === "open_app") {
            command = `start https://www.${key}.com`;
        }
        else if (action === "open_website" && apps[key]) {
            command = apps[key];
        }
    }

    // ========================
    // 🛡️ ULTRA SAFETY SYSTEM
    // ========================
    const dangerous = ["shutdown", "restart", "format", "delete", "wipe"];

    if (action === "system" && dangerous.includes(key)) {
        return JSON.stringify({
            success: false,
            blocked: true,
            message: "⚠️ Safety system blocked this system command"
        });
    }

    // ========================
    // ❌ FINAL VALIDATION
    // ========================
    if (!command) {
        return JSON.stringify({
            success: false,
            error: "Command not supported by system"
        });
    }

    // ========================
    // ⚡ EXECUTE COMMAND (UPDATED FOR LOOP)
    // ========================
    try {
        // 4. Wait for the OS to actually execute the command
        await execPromise(command);
        
        console.log("Executed:", command);
        
        return JSON.stringify({
            success: true,
            action,
            target,
            message: `Executed ${action} → ${target}`
        });
    } catch (error) {
        // 5. Catch system errors (e.g., app not installed) so the AI knows!
        console.error("Execution error:", error.message);
        
        return JSON.stringify({
            success: false,
            action,
            target,
            error: error.message,
            message: `Failed to execute ${action} → ${target}`
        });
    }
}