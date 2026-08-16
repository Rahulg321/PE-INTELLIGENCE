import "@repo/env/load";
import { env } from "./env";
import { dispatch } from "./dispatch";

const server = Bun.serve({
    port: env.port,
    async fetch(request) {
        const url = new URL(request.url);

        if (request.method === "GET" && url.pathname === "/health") {
            return Response.json({ ok: true });
        }

        if (request.method === "POST" && url.pathname === "/internal/crm/dispatch") {
            const result = await dispatch();
            return Response.json({ ok: true, ...result });
        }

        return new Response("Not found", { status: 404 });
    },
});

const interval = setInterval(() => {
    void dispatch().catch((error) => console.error("dispatch failed", error));
}, 60_000);

async function shutdown() {
    clearInterval(interval);
    server.stop();
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

void dispatch().catch((error) => console.error("initial dispatch failed", error));

console.log(`Agent listening on http://localhost:${server.port}`);
