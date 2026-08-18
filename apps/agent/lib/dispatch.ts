import { db, companies, agentTasks } from "db";
import { and, eq, isNull } from "drizzle-orm";
import { claimDue, type AgentTask } from "./claim";
import { getLane } from "../agents";
import { logger } from "./logger";

export async function dispatch() {
    const tasks = await claimDue();
    if (tasks.length === 0) {
        logger.debug("dispatch: no due tasks");
        return { claimed: 0 };
    }

    logger.info(
        `dispatch: claimed ${tasks.length} task(s)`,
        tasks.map((t) => ({ id: t.id, kind: t.kind, entityType: t.entityType, entityId: t.entityId })),
    );

    for (const task of tasks) {
        await process(task);
    }

    return { claimed: tasks.length };
}

async function process(task: AgentTask) {
    if (task.entityType === "company") {
        await db
            .update(companies)
            .set({ enrichmentStatus: "RUNNING" })
            .where(eq(companies.id, task.entityId));
    }

    try {
        const outcome = await getLane(task).run(task);
        await completeTask(task, outcome);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error(`task[${task.id}] kind=${task.kind} lane failed`, message);
        await failTask(task, message);
    }
}

async function completeTask(task: AgentTask, outcome: string) {
    await db
        .update(agentTasks)
        .set({ finishedAt: new Date(), outcome, leasedUntil: null })
        .where(eq(agentTasks.id, task.id));
    logger.info(`task[${task.id}] kind=${task.kind} completed outcome="${outcome}"`);
    await markCompanyDoneIfIdle(task);
}

async function failTask(task: AgentTask, message: string) {
    if (task.attempts < 3) {
        await db
            .update(agentTasks)
            .set({
                leasedUntil: null,
                dueAt: new Date(Date.now() + task.attempts * 30_000),
            })
            .where(eq(agentTasks.id, task.id));
        logger.warn(`task[${task.id}] kind=${task.kind} will retry (attempt ${task.attempts + 1}/3)`);
        return;
    }

    await db
        .update(agentTasks)
        .set({
            finishedAt: new Date(),
            outcome: `failed: ${message}`,
            leasedUntil: null,
        })
        .where(eq(agentTasks.id, task.id));
    logger.error(`task[${task.id}] kind=${task.kind} failed permanently after 3 attempts: ${message}`);
    await markCompanyDoneIfIdle(task);
}

async function markCompanyDoneIfIdle(task: AgentTask) {
    if (task.entityType !== "company") return;

    const open = await db
        .select({ id: agentTasks.id })
        .from(agentTasks)
        .where(and(eq(agentTasks.entityId, task.entityId), isNull(agentTasks.finishedAt)))
        .limit(1);

    if (open.length === 0) {
        await db
            .update(companies)
            .set({ enrichmentStatus: "DONE" })
            .where(eq(companies.id, task.entityId));
    }
}
