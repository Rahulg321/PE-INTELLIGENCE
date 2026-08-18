type Level = "debug" | "info" | "warn" | "error";

const fmt = (value: unknown): string => {
    if (value instanceof Error) return value.stack ?? value.message;
    if (typeof value === "string") return value;
    if (typeof value === "object" && value !== null) return JSON.stringify(value);
    return String(value);
};

function log(level: Level, ...args: unknown[]) {
    const parts = args.map(fmt);
    console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}] ${parts.join(" ")}`);
}

export const logger = {
    debug: (...args: unknown[]) => log("debug", ...args),
    info: (...args: unknown[]) => log("info", ...args),
    warn: (...args: unknown[]) => log("warn", ...args),
    error: (...args: unknown[]) => log("error", ...args),
};
