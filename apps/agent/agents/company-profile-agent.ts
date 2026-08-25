import { getModel, isModelAvailable, type ModelTier } from "@repo/ai";
import type { TaskRef } from "../lib/task";
import { loadCompanyContext } from "../lib/context";
import { buildCompanyProfileInstructions } from "../instructions/company-profile";
import { readCompanyHistoryTool } from "../tools/read-company-history";
import { researchCompanyTool } from "../tools/research-company";
import { recordFactTool } from "../tools/record-fact";
import { writeBriefTool } from "../tools/write-brief";
import { createAuditHook } from "../hooks/audit";
import { runAgentLoop, type LaneDeps } from "../lib/agent-loop";
import { START_PROMPT } from "../prompts";
import { logger } from "../lib/logger";

export async function run(
    task: TaskRef,
    deps: LaneDeps = {},
): Promise<string> {
    const ctx = await loadCompanyContext(task.entityId);
    if (!ctx) return "company not found";

    const modelTier = deps.modelTier ?? "research";
    logger.info(
        `company profile lane: company=${ctx.company.displayName} (${ctx.company.id}) modelTier=${modelTier}`,
    );

    if (!isModelAvailable(modelTier)) {
        logger.warn(
            `company profile lane: model tier "${modelTier}" not configured (set DEEPSEEK_API_KEY or OPENAI_API_KEY)`,
        );
        return "no model configured";
    }

    const result = await runAgentLoop({
        step: deps.step,
        model: getModel(modelTier),
        tools: {
            readCompanyHistory: readCompanyHistoryTool,
            researchCompany: researchCompanyTool,
            recordFact: recordFactTool,
            writeBrief: writeBriefTool,
        },
        instructions: buildCompanyProfileInstructions(ctx),
        toolsContext: {
            readCompanyHistory: ctx,
            recordFact: {
                taskId: task.id,
                workspaceId: task.workspaceId,
                entityId: task.entityId,
            },
            writeBrief: { entityId: task.entityId },
        },
        prompt: START_PROMPT,
        maxTurns: 12,
        onStepEnd: createAuditHook(task),
    });

    const outcome = result.text ? "brief written" : "research complete";
    logger.info(
        `company profile lane: done company=${ctx.company.displayName} turns=${result.turns} outcome=${outcome}`,
    );
    return outcome;
}
