import { exec } from "child_process";

export default function performWindowsAction(action, target) {
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

    // ------------------------
    // OPEN APP
    // ------------------------
    if (action === "open_app") {
        command = apps[target.toLowerCase()];
    }

    // ------------------------
    // OPEN FOLDER
    // ------------------------
    else if (action === "open_folder") {
        command = `explorer "${target}"`;
    }

    // ------------------------
    // OPEN WEBSITE
    // ------------------------
    else if (action === "open_website") {
        const url = websites[target.toLowerCase()] || target;

        // opens in default browser
        command = `start ${url}`;
    }

    // ------------------------
    // SYSTEM COMMANDS
    // ------------------------
    else if (action === "system") {
        if (target === "shutdown") {
            command = "shutdown /s /t 0";
        }

        if (target === "restart") {
            command = "shutdown /r /t 0";
        }

        if (target === "lock") {
            command = "rundll32.exe user32.dll,LockWorkStation";
        }
    }

    // ------------------------
    // SAFETY CHECK
    // ------------------------
    if (!command) {
        return JSON.stringify({
            success: false,
            error: "Command not supported"
        });
    }

    // ------------------------
    // EXECUTE
    // ------------------------
    exec(command, (error) => {
        if (error) {
            console.error("Execution error:", error.message);
        } else {
            console.log("Executed:", command);
        }
    });

    return JSON.stringify({
        success: true,
        message: `Executed ${action} → ${target}`
    });
}