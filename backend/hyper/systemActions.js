// controllar/systemActions.js
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

export default async function performWindowsAction(action, target) {
    console.log(`[OS Execution] Action: ${action} | Target: ${target}`);

    try {
        switch (action) {
            case "open_app":
                // Standard Windows command to start an application
                await execPromise(`start ${target}`);
                return JSON.stringify({ success: true, message: `Successfully opened app: ${target}` });

            case "open_website":
                // Sanitizes URL format if it doesn't already have http/https
                const url = target.startsWith("http") ? target : `https://${target}.com`;
                await execPromise(`start ${url}`);
                return JSON.stringify({ success: true, message: `Successfully navigated to website: ${url}` });

            case "open_folder":
                // Standard Windows explorer command to open directory paths
                await execPromise(`explorer "${target}"`);
                return JSON.stringify({ success: true, message: `Successfully opened folder: ${target}` });

            case "system":
                if (target === "lock") {
                    await execPromise("rundll32.exe user32.dll,LockWorkStation");
                    return JSON.stringify({ success: true, message: "PC locked successfully." });
                }
                if (target === "restart") {
                    await execPromise("shutdown /r /t 0");
                    return JSON.stringify({ success: true, message: "PC restart sequence initiated." });
                }
                if (target === "shutdown") {
                    await execPromise("shutdown /s /t 0");
                    return JSON.stringify({ success: true, message: "PC shutdown sequence initiated." });
                }
                throw new Error(`Unknown system action: ${target}`);

            default:
                throw new Error(`Unsupported action type: ${action}`);
        }
    } catch (error) {
        console.error(`[OS Error] Failed executing ${action}:`, error.message);
        return JSON.stringify({ success: false, error: error.message });
    }
}