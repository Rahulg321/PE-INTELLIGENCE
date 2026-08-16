import "@repo/env/load";

function getPort() {
    const port = Number(process.env.AGENT_PORT ?? 4000);
    if (!Number.isInteger(port) || port < 1 || port > 65_535) {
        throw new Error("AGENT_PORT must be an integer between 1 and 65535");
    }
    return port;
}

export const env = Object.freeze({
    port: getPort(),
    deepSeekApiKey: process.env.DEEPSEEK_API_KEY ?? null,
    deepSeekModel: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
});
