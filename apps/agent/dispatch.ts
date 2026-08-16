import { db, agentTasks, companies } from "db";
import { and, eq, isNull } from "drizzle-orm";
import { claimDue, type AgentTask } from "./claim";
import { runBrandLane } from "./brand-lane";
import { runCompanyProfileLane } from "./company-profile-lane";

type Lane = (task: AgentTask) => Promise<string>;

export async function dispatch() {
    const tasks = await claimDue();
    if (tasks.length === 0) return { claimed: 0 };

    const brand = tasks.filter((t) => t.kind === "brand");
    const research = tasks.filter((t) => t.kind !== "brand");

    for (const task of brand) {
        await process(task, runBrandLane);
    }
    for (const task of research) {
        await process(task, runCompanyProfileLane);
    }

    return { claimed: tasks.length };
}

async function process(task: AgentTask, lane: Lane) {
    if (task.entityType === "company") {
        await db
            .update(companies)
            .set({ enrichmentStatus: "RUNNING" })
            .where(eq(companies.id, task.entityId));
    }

    try {
        const outcome = await lane(task);
        await completeTask(task, outcome);
    } catch (error) {
        await failTask(task, error instanceof Error ? error.message : String(error));
    }
}

async function completeTask(task: AgentTask, outcome: string) {
    await db
        .update(agentTasks)
        .set({ finishedAt: new Date(), outcome, leasedUntil: null })
        .where(eq(agentTasks.id, task.id));
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
