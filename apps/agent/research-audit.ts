import { db, agentEvents } from "db";
import type { AgentTask } from "./claim";
import type { ResearchStep } from "@repo/ai";

const randomId = () => crypto.randomUUID();

export function createAuditHook(task: AgentTask) {
    let stepNumber = 0;

    return async (step: ResearchStep) => {
        stepNumber += 1;
        await db.insert(agentEvents).values({
            id: randomId(),
            workspaceId: task.workspaceId,
            taskId: task.id,
            entityType: task.entityType,
            entityId: task.entityId,
            kind: "step",
            stepNumber,
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
