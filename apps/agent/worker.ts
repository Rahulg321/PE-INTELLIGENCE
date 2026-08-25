import "@repo/env/load";
import { and, isNull, lt } from "drizzle-orm";
import { agentTasks, db, withDb } from "db";
import { logger } from "./lib/logger";
import { enrichmentTaskSchema, type EnrichmentTask } from "./lib/task";
import { EnrichmentWorkflow } from "./workflows/enrichment";

export { EnrichmentWorkflow };

export type Env = {
    HYPERDRIVE: Hyperdrive;
    ENRICHMENT_WORKFLOW: Workflow<EnrichmentTask>;
};

/** Tasks older than this that never started are re-created as workflows by the cron sweep. */
const ORPHAN_GRACE_MS = 5 * 60_000;

async function startWorkflow(env: Env, task: EnrichmentTask): Promise<void> {
    try {
        const instance = await env.ENRICHMENT_WORKFLOW.create({
            id: task.taskId,
            params: task,
        });
        logger.info(`workflow created task=${task.taskId} kind=${task.kind} id=${instance.id}`);
    } catch (error) {
        // The instance id is the task id, so re-creating an existing instance is
        // expected on queue redelivery — that IS the idempotency guarantee. Any
        // other failure is rethrown so the queue retries the message.
        if (isDuplicateWorkflow(error)) {
            logger.warn(`workflow create task=${task.taskId} skipped (already exists)`);
            return;
        }
        throw error;
    }
}

function isDuplicateWorkflow(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error);
    return /already exist|already running|already started|instance .* exist/i.test(message);
}

async function sweepOrphans(env: Env): Promise<void> {
    const orphans = await db
        .select({
            id: agentTasks.id,
            workspaceId: agentTasks.workspaceId,
            kind: agentTasks.kind,
            entityType: agentTasks.entityType,
            entityId: agentTasks.entityId,
            reason: agentTasks.reason,
        })
        .from(agentTasks)
        .where(
            and(
                isNull(agentTasks.startedAt),
                isNull(agentTasks.finishedAt),
                lt(agentTasks.dueAt, new Date(Date.now() - ORPHAN_GRACE_MS)),
            ),
        );

    if (orphans.length > 0) {
        logger.info(
            `orphan sweep: ${orphans.length} task(s) never started`,
            orphans.map((o) => o.id),
        );
    }

    for (const row of orphans) {
        await startWorkflow(env, { taskId: row.id, ...row });
    }
}

export default {
    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url);
        if (request.method === "GET" && url.pathname === "/health") {
            return Response.json({ ok: true });
        }
        return new Response("Not found", { status: 404 });
    },

    async scheduled(_event: ScheduledController, env: Env): Promise<void> {
        await withDb(env.HYPERDRIVE.connectionString, async () => {
            await sweepOrphans(env);
        });
    },

    async queue(batch: MessageBatch<EnrichmentTask>, env: Env): Promise<void> {
        for (const message of batch.messages) {
            try {
                const task = enrichmentTaskSchema.parse(message.body);
                await startWorkflow(env, task);
            } catch (error) {
                // Producer enqueued malformed data — retry per queue config, then DLQ.
                logger.error("queue consumer failed to start workflow", error);
                message.retry();
            }
        }
    },
};
