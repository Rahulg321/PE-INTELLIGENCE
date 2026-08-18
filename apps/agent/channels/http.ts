import { dispatch } from "../lib/dispatch";
import { env } from "../lib/env";
import { logger } from "../lib/logger";

export function createServer() {
    return Bun.serve({
        port: env.port,
        async fetch(request) {
            const url = new URL(request.url);

            if (request.method === "GET" && url.pathname === "/health") {
                return Response.json({ ok: true });
            }

            if (request.method === "POST" && url.pathname === "/internal/crm/dispatch") {
                logger.info("dispatch requested via HTTP (async)");
                void dispatch()
                    .then((result) => logger.info(`http dispatch finished claimed=${result.claimed}`))
                    .catch((error) => logger.error("http dispatch failed", error));
                return Response.json({ ok: true });
            }

            return new Response("Not found", { status: 404 });
        },
    });
}
