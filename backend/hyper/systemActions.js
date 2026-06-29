// controllar/systemActions.js
import { exec } from "child_process";
import util from "util";
import fs from "fs/promises";
import path from "path";
const execPromise = util.promisify(exec);

/**
 * 🛡️ Security Sanitization Engine
 * Prevents command injection by stripping shell metacharacters.
 */
function sanitize(input) {
    if (typeof input !== 'string') return '';
    // Block meta-characters used for shell injection
    return input.replace(/[&|;><$`!]/g, "").trim();
}

export default async function performWindowsAction(action, target, extraArgs = {}) {
    const cleanTarget = sanitize(target);
    console.log(`[OS Execution] Action: ${action} | Target: ${cleanTarget}`, extraArgs);

    try {
        switch (action) {
            case "open_app":
                // 🛡️ Quoted and sanitized path
                await execPromise(`start "" "${cleanTarget}"`);
                return JSON.stringify({ success: true, message: `Successfully opened app: ${cleanTarget}` });

            case "open_website": {
                const url = cleanTarget.startsWith("http") ? cleanTarget : `https://${cleanTarget}.com`;
                // 🛡️ Standardizing to use start with a sanitized URL
                await execPromise(`start ${url}`);
                return JSON.stringify({ success: true, message: `Successfully navigated to website: ${url}` });
            }

            case "open_folder":
                await execPromise(`explorer "${cleanTarget}"`);
                return JSON.stringify({ success: true, message: `Successfully opened directory: ${cleanTarget}` });

            case "list_directory": {
                const files = await fs.readdir(cleanTarget);
                return JSON.stringify({ success: true, target: cleanTarget, files });
            }

            case "read_file": {
                const content = await fs.readFile(cleanTarget, "utf-8");
                return JSON.stringify({ success: true, filename: path.basename(cleanTarget), content: content.slice(0, 5000) }); 
            }

            case "write_file": {
                const fileContent = extraArgs.fileContent;
                if (!fileContent) throw new Error("Missing fileContent parameter for write_file action.");
                await fs.mkdir(path.dirname(cleanTarget), { recursive: true });
                await fs.writeFile(cleanTarget, fileContent, "utf-8");
                return JSON.stringify({ success: true, message: `Successfully written file to: ${cleanTarget}` });
            }

            case "delete_file":
                await fs.rm(cleanTarget, { force: true, recursive: true });
                return JSON.stringify({ success: true, message: `Permanently deleted: ${cleanTarget}` });

            case "manage_process":
                if (cleanTarget === "list") {
                    const { stdout } = await execPromise("tasklist");
                    return JSON.stringify({ success: true, processes: stdout.slice(0, 8000) });
                }
                if (cleanTarget === "kill") {
                    const processName = sanitize(extraArgs.processName);
                    if (!processName) throw new Error("Missing processName parameter.");
                    // Ensure the process name doesn't contain malicious segments
                    await execPromise(`taskkill /IM "${processName}" /F`);
                    return JSON.stringify({ success: true, message: `Force terminated process: ${processName}` });
                }
                throw new Error(`Unknown process action sub-type: ${cleanTarget}`);

            case "create_folder":
                await fs.mkdir(cleanTarget, { recursive: true });
                return JSON.stringify({ success: true, message: `Successfully created folder at: ${cleanTarget}` });

            case "system":
                if (cleanTarget === "lock") {
                    await execPromise("rundll32.exe user32.dll,LockWorkStation");
                    return JSON.stringify({ success: true, message: "PC locked successfully." });
                }
                if (cleanTarget === "restart") {
                    await execPromise("shutdown /r /t 0");
                    return JSON.stringify({ success: true, message: "PC restart sequence initiated." });
                }
                if (cleanTarget === "shutdown") {
                    await execPromise("shutdown /s /t 0");
                    return JSON.stringify({ success: true, message: "PC shutdown sequence initiated." });
                }
                throw new Error(`Unknown system action: ${cleanTarget}`);

            default:
                throw new Error(`Unsupported action type: ${action}`);
        }
    } catch (error) {
        console.error(`[OS Error] Failed executing ${action}:`, error.message);
        return JSON.stringify({ success: false, error: error.message });
    }
}