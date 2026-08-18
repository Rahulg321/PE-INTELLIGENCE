import { dispatch } from "../lib/dispatch";
import { logger } from "../lib/logger";

export function startPolling(intervalMs = 60_000) {
    const interval = setInterval(() => {
        void dispatch().catch((error) =>
            logger.error("scheduled dispatch failed", error),
        );
    }, intervalMs);

    void dispatch().catch((error) =>
        logger.error("initial dispatch failed", error),
    );

    return {
        stop: () => {
            clearInterval(interval);
            logger.info("polling stopped");
        },
    };
}
