import { getModel, isModelAvailable, type ModelTier } from "@repo/ai";
import { db, companies } from "db";
import { eq } from "drizzle-orm";
import type { TaskRef } from "../lib/task";
import { buildBrandInstructions } from "../instructions/brand";
import { lookupBrandTool } from "../tools/brand-lookup";
import { recordBrandTool } from "../tools/record-brand";
import { createAuditHook } from "../hooks/audit";
import { runAgentLoop, type LaneDeps } from "../lib/agent-loop";
import { START_PROMPT } from "../prompts";
import { logger } from "../lib/logger";

export async function run(
    task: TaskRef,
    deps: LaneDeps = {},
): Promise<string> {
    const company = await db.query.companies.findFirst({
        where: { id: task.entityId },
        columns: { id: true, displayName: true, website: true },
    });
    if (!company) return "company not found";

    const modelTier = deps.modelTier ?? "fast";
    logger.info(`brand lane: company=${company.displayName} (${company.id}) modelTier=${modelTier}`);

    if (!isModelAvailable(modelTier)) {
        logger.warn(
            `brand lane: model tier "${modelTier}" not configured (set DEEPSEEK_API_KEY or OPENAI_API_KEY)`,
        );
        return "no model configured";
    }

    const result = await runAgentLoop({
        step: deps.step,
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
        prompt: START_PROMPT,
        maxTurns: 10,
        onStepEnd: createAuditHook(task),
    });

    logger.info(`brand lane: done company=${company.displayName} turns=${result.turns}`);
    return "brand processed";
}
