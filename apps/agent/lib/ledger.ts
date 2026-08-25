import { and, eq, isNull } from "drizzle-orm";
import { agentTasks, companies, db } from "db";

/**
 * Ledger helpers used by the workflow path to keep `agent_tasks` /
 * `companies.enrichmentStatus` in sync with execution. All functions assume
 * they run inside a `withDb()` scope (request-scoped Postgres client).
 */

export type EnrichmentStatus = "PENDING" | "RUNNING" | "DONE";

export async function setCompanyEnrichmentStatus(
    entityId: string,
    status: EnrichmentStatus,
): Promise<void> {
    await db
        .update(companies)
        .set({ enrichmentStatus: status })
        .where(eq(companies.id, entityId));
}

export async function completeTask(taskId: string, outcome: string): Promise<void> {
    await db
        .update(agentTasks)
        .set({ finishedAt: new Date(), outcome, leasedUntil: null })
        .where(eq(agentTasks.id, taskId));
}

export async function markTaskStarted(taskId: string): Promise<void> {
    await db
        .update(agentTasks)
        .set({ startedAt: new Date() })
        .where(eq(agentTasks.id, taskId));
}

/**
 * If no other tasks are still open for the entity, mark it DONE.
 * Mirrors the previous dispatch.ts behavior for the workflow path.
 */
export async function markCompanyDoneIfIdle(
    entityId: string,
    entityType: string,
): Promise<void> {
    if (entityType !== "company") return;

    const open = await db
        .select({ id: agentTasks.id })
        .from(agentTasks)
        .where(
            and(eq(agentTasks.entityId, entityId), isNull(agentTasks.finishedAt)),
        )
        .limit(1);

    if (open.length === 0) {
        await setCompanyEnrichmentStatus(entityId, "DONE");
    }
}
