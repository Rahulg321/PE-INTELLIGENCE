import "@repo/env/load";
import { createServer } from "./channels/http";
import { startPolling } from "./schedules/poll";
import { env } from "./lib/env";
import { logger } from "./lib/logger";

const server = createServer();
const polling = startPolling();

async function shutdown() {
    logger.info("shutting down");
    polling.stop();
    server.stop();
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

logger.info(`agent listening on http://localhost:${env.port}`);
