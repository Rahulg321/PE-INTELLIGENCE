import { ToolLoopAgent, isStepCount } from "ai";
import { z } from "zod";
import { getModel, isModelAvailable, type ModelTier } from "@repo/ai";
import { db, companies } from "db";
import { eq } from "drizzle-orm";
import type { AgentTask } from "../lib/claim";
import { buildBrandInstructions } from "../instructions/brand";
import { lookupBrandTool } from "../tools/brand-lookup";
import { recordBrandTool } from "../tools/record-brand";
import { createAuditHook } from "../hooks/audit";
import { START_PROMPT } from "../prompts";
import { logger } from "../lib/logger";

export async function run(
    task: AgentTask,
    options?: { modelTier?: ModelTier },
): Promise<string> {
    const company = await db.query.companies.findFirst({
        where: { id: task.entityId },
        columns: { id: true, displayName: true, website: true },
    });
    if (!company) return "company not found";

    const modelTier = options?.modelTier ?? "fast";
    logger.info(`brand lane: company=${company.displayName} (${company.id}) modelTier=${modelTier}`);

    if (!isModelAvailable(modelTier)) {
        logger.warn(
            `brand lane: model tier "${modelTier}" not configured (set DEEPSEEK_API_KEY or OPENAI_API_KEY)`,
        );
        return "no model configured";
    }

    const agent = new ToolLoopAgent({
        model: getModel(modelTier),
        tools: {
            lookupBrand: lookupBrandTool,
            recordBrand: recordBrandTool,
        },
        instructions: buildBrandInstructions({
            displayName: company.displayName,
            website: company.website,
        }),
        toolsContext: {
            lookupBrand: { website: company.website },
            recordBrand: { entityId: company.id },
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
        stopWhen: isStepCount(10),
    });

    const result = await agent.generate({
        prompt: START_PROMPT,
        options: { modelTier: options?.modelTier },
        onStepEnd: createAuditHook(task),
    });

    logger.info(`brand lane: done company=${company.displayName} steps=${result.steps.length}`);
    return "brand processed";
}
