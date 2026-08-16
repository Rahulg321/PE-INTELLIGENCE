import { db } from "db";
import { sql } from "drizzle-orm";

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

type AgentTaskRow = {
    id: string;
    workspace_id: string;
    kind: string;
    entity_type: string;
    entity_id: string;
    reason: string | null;
    priority: number;
    budget: number;
    due_at: Date;
    leased_until: Date | null;
    started_at: Date | null;
    attempts: number;
    finished_at: Date | null;
    outcome: string | null;
};

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
    const rows = (result.rows ?? []) as unknown as AgentTaskRow[];
    return rows.map(mapTask);
}
