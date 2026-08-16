import { deepSeekChat, runResearchTask } from "@repo/ai";
import type { AgentTask } from "./claim";
import { loadCompanyContext } from "./research-context";
import { buildPreamble } from "./research-preamble";
import { buildResearchTools } from "./research-tools";
import { createAuditHook } from "./research-audit";
import { env } from "./env";

export async function runCompanyProfileLane(task: AgentTask): Promise<string> {
    if (!env.deepSeekApiKey) {
        return "no model configured (DEEPSEEK_API_KEY missing)";
    }

    const ctx = await loadCompanyContext(task.entityId);
    if (!ctx) return "company not found";

    const system = buildPreamble(ctx);
    const tools = buildResearchTools(ctx, task);
    const auditStep = createAuditHook(task);

    const result = await runResearchTask({
        model: deepSeekChat,
        system,
        tools,
        budget: task.budget,
        onStepFinish: auditStep,
    });

    return result.text ? "brief written" : "research complete";
}
