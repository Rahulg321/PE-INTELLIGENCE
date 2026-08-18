import { db, agentEvents } from "db";
import type { AgentTask } from "../lib/claim";
import { logger } from "../lib/logger";

const randomId = () => crypto.randomUUID();

export type AuditStep = {
    stepNumber: number;
    text: string;
    toolCalls: unknown[];
    toolResults: unknown[];
    finishReason: unknown;
    usage: unknown;
};

export function createAuditHook(task: AgentTask) {
    return async (step: AuditStep) => {
        logger.debug(
            `task[${task.id}] step ${step.stepNumber} finish=${String(step.finishReason)}`,
            step.toolCalls?.map((tc) => ({ tool: (tc as { toolName?: string }).toolName })),
        );
        await db.insert(agentEvents).values({
            id: randomId(),
            workspaceId: task.workspaceId,
            taskId: task.id,
            entityType: task.entityType,
            entityId: task.entityId,
            kind: "step",
            stepNumber: step.stepNumber,
            payload: {
                text: step.text,
                toolCalls: step.toolCalls,
                toolResults: step.toolResults,
                finishReason: step.finishReason,
                usage: step.usage,
            },
        });
    };
}
