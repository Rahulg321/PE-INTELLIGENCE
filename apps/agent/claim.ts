import { db } from "db";
import { sql } from "drizzle-orm";
import { z } from "zod";

export type AgentTask = {
    id: string;
    workspaceId: string;
    kind: string;
    entityType: string;
    entityId: string;
    reason: string | null;
    priority: number;
    budget: number;
    dueAt: Date;
    leasedUntil: Date | null;
    startedAt: Date | null;
    attempts: number;
    finishedAt: Date | null;
    outcome: string | null;
};

const agentTaskRowSchema = z.object({
    id: z.string(),
    workspace_id: z.string(),
    kind: z.string(),
    entity_type: z.string(),
    entity_id: z.string(),
    reason: z.string().nullable(),
    priority: z.number(),
    budget: z.number(),
    due_at: z.date(),
    leased_until: z.date().nullable(),
    started_at: z.date().nullable(),
    attempts: z.number(),
    finished_at: z.date().nullable(),
    outcome: z.string().nullable(),
});

const agentTaskRowsSchema = z.array(agentTaskRowSchema);

type AgentTaskRow = z.infer<typeof agentTaskRowSchema>;

function mapTask(row: AgentTaskRow): AgentTask {
    return {
        id: row.id,
        workspaceId: row.workspace_id,
        kind: row.kind,
        entityType: row.entity_type,
        entityId: row.entity_id,
        reason: row.reason,
        priority: row.priority,
        budget: row.budget,
        dueAt: row.due_at,
        leasedUntil: row.leased_until,
        startedAt: row.started_at,
        attempts: row.attempts,
        finishedAt: row.finished_at,
        outcome: row.outcome,
    };
}

export async function claimDue(limit = 12): Promise<AgentTask[]> {
    const result = await db.execute(sql`
        WITH due AS (
            SELECT id FROM agent_tasks
            WHERE finished_at IS NULL
              AND due_at <= now()
              AND (leased_until IS NULL OR leased_until <= now())
              AND attempts < 3
            ORDER BY priority DESC, due_at ASC
            LIMIT ${limit}
            FOR UPDATE SKIP LOCKED
        )
        UPDATE agent_tasks t
        SET leased_until = now() + interval '2 minutes',
            started_at = coalesce(t.started_at, now()),
            attempts = t.attempts + 1
        FROM due
        WHERE t.id = due.id
        RETURNING
            t.id,
            t.workspace_id,
            t.kind,
            t.entity_type,
            t.entity_id,
            t.reason,
            t.priority,
            t.budget,
            t.due_at,
            t.leased_until,
            t.started_at,
            t.attempts,
            t.finished_at,
            t.outcome
    `);
    return agentTaskRowsSchema.parse(result.rows ?? []).map(mapTask);
}
