import "@repo/env/load";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { agentEvents, agentTasks, companies, db, workspaces } from "db";

/**
 * End-to-end test harness for the agent.
 *
 * Usage:
 *   bun scripts/test-task.ts brand             # trigger via running agent (default)
 *   bun scripts/test-task.ts company_profile
 *   bun scripts/test-task.ts brand direct      # call the lane directly (no agent server needed)
 *
 * It creates a throwaway company + agent_task, triggers the agent, waits for
 * completion, prints the ledger state + audit trail, then cleans up.
 */

const KIND = process.argv[2] ?? "brand";
const MODE = process.argv[3] ?? "dispatch";
const AGENT_URL = process.env.AGENT_URL ?? "http://localhost:4000";
const TIMEOUT_MS = 180_000;

const workspace = await db.query.workspaces.findFirst({ columns: { id: true } });
if (!workspace) {
    console.error("no workspace found in local db — run onboarding or insert one");
    process.exit(1);
}

const id = randomUUID();
await db.insert(companies).values({
    id,
    workspaceId: workspace.id,
    displayName: "Test Co " + KIND,
    website: "example.com",
    enrichmentStatus: "PENDING",
});
await db.insert(agentTasks).values({
    id,
    workspaceId: workspace.id,
    kind: KIND,
    entityType: "company",
    entityId: id,
    reason: "test harness",
    priority: KIND === "brand" ? 900 : 40,
    dueAt: new Date(),
});

const done = async () => {
    const row = await db.query.agentTasks.findFirst({
        where: { id },
        columns: { finishedAt: true, outcome: true, attempts: true },
    });
    return row?.finishedAt ? row : null;
};

try {
    if (MODE === "direct") {
        const { getLane } = await import("../agents");
        const outcome = await getLane({
            id,
            workspaceId: workspace.id,
            kind: KIND,
            entityType: "company",
            entityId: id,
            reason: "test harness",
        }).run({ id, workspaceId: workspace.id, kind: KIND, entityType: "company", entityId: id, reason: "test harness" });
        console.log("DIRECT OUTCOME:", outcome);
    } else {
        const res = await fetch(`${AGENT_URL}/internal/crm/dispatch`, { method: "POST" });
        console.log(`dispatch trigger -> HTTP ${res.status}`, await res.text());
    }

    const deadline = Date.now() + TIMEOUT_MS;
    let final = await done();
    while (!final && Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 2000));
        final = await done();
    }

    if (!final) {
        console.error("TIMED OUT — task not finished. Check the agent logs.");
        const events = await db.query.agentEvents.findMany({
            where: { taskId: id },
            columns: { kind: true, stepNumber: true },
            orderBy: { createdAt: "asc" },
        });
        console.log("events so far:", JSON.stringify(events));
        process.exit(1);
    }

    console.log("TASK RESULT:", JSON.stringify(final, null, 2));

    const company = await db.query.companies.findFirst({
        where: { id },
        columns: { enrichmentStatus: true, legalName: true, industry: true, logoUrl: true, description: true },
    });
    console.log("COMPANY:", JSON.stringify(company, null, 2));

    const events = await db.query.agentEvents.findMany({
        where: { taskId: id },
        columns: { kind: true, stepNumber: true },
        orderBy: { createdAt: "asc" },
    });
    console.log(`AUDIT (${events.length} events):`, JSON.stringify(events));
} finally {
    await db.delete(agentEvents).where(eq(agentEvents.taskId, id));
    await db.delete(agentTasks).where(eq(agentTasks.id, id));
    await db.delete(companies).where(eq(companies.id, id));
    console.log("cleaned up test data");
}
