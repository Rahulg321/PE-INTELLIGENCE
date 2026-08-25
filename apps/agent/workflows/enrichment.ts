import {
    WorkflowEntrypoint,
    type WorkflowEvent,
    type WorkflowStep,
} from "cloudflare:workers";
import { withDb } from "db";
import { getLane } from "../agents";
import { logger } from "../lib/logger";
import {
    completeTask,
    markCompanyDoneIfIdle,
    markTaskStarted,
    setCompanyEnrichmentStatus,
} from "../lib/ledger";
import { enrichmentTaskSchema, toTaskRef, type EnrichmentTask } from "../lib/task";
import type { DurableStep } from "../lib/agent-loop";
import type { Env } from "../worker";

/**
 * One durable workflow instance per agent task (instance id = task id, which
 * makes re-creating it idempotent). The queue consumer starts it; steps are
 * durable and retry individually, so the run survives Worker eviction.
 *
 * The agent loop runs step-by-step: each LLM turn, each side-effecting tool
 * execution, and each audit write is its own durable step. On replay after an
 * eviction, completed steps return their cached outputs instead of re-running,
 * so LLM calls, tool side effects, and audit rows are never duplicated.
 */
export class EnrichmentWorkflow extends WorkflowEntrypoint<Env, EnrichmentTask> {
    override async run(
        event: WorkflowEvent<EnrichmentTask>,
        step: WorkflowStep,
    ): Promise<string> {
        const task = enrichmentTaskSchema.parse(event.payload);
        const ref = toTaskRef(task);

        logger.info(
            `workflow[${task.taskId}] kind=${task.kind} entity=${task.entityType}:${task.entityId} starting`,
        );

        if (task.entityType === "company") {
            await step.do("mark running", async () =>
                withDb(this.env.HYPERDRIVE.connectionString, () =>
                    setCompanyEnrichmentStatus(task.entityId, "RUNNING"),
                ),
            );
        }

        await step.do("mark started", async () =>
            withDb(this.env.HYPERDRIVE.connectionString, () =>
                markTaskStarted(task.taskId),
            ),
        );

        let outcome: string;
        try {
            outcome = await withDb(this.env.HYPERDRIVE.connectionString, async () =>
                getLane(ref).run(ref, { step: step as unknown as DurableStep }),
            );
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            outcome = `failed: ${message}`;
            logger.error(`workflow[${task.taskId}] lane failed`, message);
        }

        await step.do("finalize", async () =>
            withDb(this.env.HYPERDRIVE.connectionString, async () => {
                await completeTask(task.taskId, outcome);
                await markCompanyDoneIfIdle(task.entityId, task.entityType);
            }),
        );

        logger.info(`workflow[${task.taskId}] finished outcome="${outcome}"`);
        return outcome;
    }
}
