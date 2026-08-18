import { ToolLoopAgent } from "ai";
import { z } from "zod";
import { getModel, isModelAvailable, type ModelTier } from "@repo/ai";
import type { AgentTask } from "../lib/claim";
import { loadCompanyContext } from "../lib/context";
import { buildCompanyProfileInstructions } from "../instructions/company-profile";
import { readCompanyHistoryTool } from "../tools/read-company-history";
import { researchCompanyTool } from "../tools/research-company";
import { recordFactTool } from "../tools/record-fact";
import { writeBriefTool } from "../tools/write-brief";
import { createAuditHook } from "../hooks/audit";
import { START_PROMPT } from "../prompts";
import { logger } from "../lib/logger";

export async function run(
    task: AgentTask,
    options?: { modelTier?: ModelTier },
): Promise<string> {
    const ctx = await loadCompanyContext(task.entityId);
    if (!ctx) return "company not found";

    const modelTier = options?.modelTier ?? "research";
    logger.info(
        `company profile lane: company=${ctx.company.displayName} (${ctx.company.id}) modelTier=${modelTier}`,
    );

    if (!isModelAvailable(modelTier)) {
        logger.warn(
            `company profile lane: model tier "${modelTier}" not configured (set DEEPSEEK_API_KEY or OPENAI_API_KEY)`,
        );
        return "no model configured";
    }

    const agent = new ToolLoopAgent({
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
        callOptionsSchema: z.object({
            modelTier: z.enum(["fast", "research"]).optional(),
        }),
        prepareCall: ({ options: callOptions, ...settings }) => ({
            ...settings,
            model: callOptions.modelTier
                ? getModel(callOptions.modelTier)
                : settings.model,
        }),
    });

    const result = await agent.generate({
        prompt: START_PROMPT,
        options: { modelTier: options?.modelTier },
        onStepEnd: createAuditHook(task),
    });

    const outcome = result.text ? "brief written" : "research complete";
    logger.info(
        `company profile lane: done company=${ctx.company.displayName} steps=${result.steps.length} outcome=${outcome}`,
    );
    return outcome;
}
