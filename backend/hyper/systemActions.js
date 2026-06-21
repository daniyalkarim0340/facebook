// controllar/systemActions.js
import { exec } from "child_process";
import util from "util";
import fs from "fs/promises";
import path from "path";

const execPromise = util.promisify(exec);

export default async function performWindowsAction(action, target, extraArgs = {}) {
    console.log(`[OS Execution] Action: ${action} | Target: ${target}`, extraArgs);

    try {
        switch (action) {
            // ── 🌐 APPLICATION & WEB CONTROLS ────────────────────────────────
            case "open_app":
                await execPromise(`start "" "${target}"`);
                return JSON.stringify({ success: true, message: `Successfully opened app: ${target}` });

            case "open_website": {
                const url = target.startsWith("http") ? target : `https://${target}.com`;
                await execPromise(`start ${url}`);
                return JSON.stringify({ success: true, message: `Successfully navigated to website: ${url}` });
            }

            // ── 📂 ADVANCED FILE LAYER CONTROLS ──────────────────────────────
            case "open_folder":
                await execPromise(`explorer "${target}"`);
                return JSON.stringify({ success: true, message: `Successfully opened directory: ${target}` });

            case "list_directory": {
                const files = await fs.readdir(target);
                return JSON.stringify({ success: true, target, files });
            }

            case "read_file": {
                const content = await fs.readFile(target, "utf-8");
                return JSON.stringify({ success: true, filename: path.basename(target), content: content.slice(0, 5000) }); // Limit read to safety thresholds
            }

            case "write_file": {
                const { fileContent } = extraArgs;
                if (!fileContent) throw new Error("Missing fileContent parameter for write_file action.");
                await fs.mkdir(path.dirname(target), { recursive: true });
                await fs.writeFile(target, fileContent, "utf-8");
                return JSON.stringify({ success: true, message: `Successfully written file to: ${target}` });
            }

            case "delete_file":
                await fs.rm(target, { force: true, recursive: true });
                return JSON.stringify({ success: true, message: `Permanently deleted: ${target}` });

            // ── ⚙️ OS PROCESS & SYSTEM LEVEL CONTROLS ──────────────────────────
            case "manage_process":
                if (target === "list") {
                    const { stdout } = await execPromise("tasklist");
                    return JSON.stringify({ success: true, processes: stdout.slice(0, 8000) });
                }
                if (target === "kill") {
                    const { processName } = extraArgs;
                    if (!processName) throw new Error("Missing processName parameter.");
                    await execPromise(`taskkill /IM "${processName}" /F`);
                    return JSON.stringify({ success: true, message: `Force terminated process: ${processName}` });
                }
                throw new Error(`Unknown process action sub-type: ${target}`);

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