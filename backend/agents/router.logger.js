import fs from "fs";

const LOG_FILE = "./router_logs.json";

export function logRoutingEvent(event) {
  const logs = fs.existsSync(LOG_FILE)
    ? JSON.parse(fs.readFileSync(LOG_FILE))
    : [];

  logs.push({
    ...event,
    timestamp: Date.now()
  });

  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}