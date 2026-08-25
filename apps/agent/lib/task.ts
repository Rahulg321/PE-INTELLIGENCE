import { z } from "zod";

/**
 * The subset of an agent task that lanes need to run. Kept independent of the
 * legacy DB-row type in `lib/claim.ts` so the workflow path doesn't depend on it.
 */
export type TaskRef = {
    id: string;
    workspaceId: string;
    kind: string;
    entityType: string;
    entityId: string;
    reason: string | null;
};

export const enrichmentTaskSchema = z.object({
    taskId: z.string().min(1),
    workspaceId: z.string().min(1),
    kind: z.string().min(1),
    entityType: z.string().min(1),
    entityId: z.string().min(1),
    reason: z.string().nullable().optional(),
    priority: z.number().int().optional(),
});

/**
 * Payload carried by the queue message AND passed as the workflow event params.
 * Web enqueues this shape (see companies-service), the queue consumer validates
 * it with `enrichmentTaskSchema`, and the workflow receives it as `event.payload`.
 */
export type EnrichmentTask = z.infer<typeof enrichmentTaskSchema>;

export function toTaskRef(task: EnrichmentTask): TaskRef {
    return {
        id: task.taskId,
        workspaceId: task.workspaceId,
        kind: task.kind,
        entityType: task.entityType,
        entityId: task.entityId,
        reason: task.reason ?? null,
    };
}
