import { tool } from "ai";
import { z } from "zod";
import type { CompanyContext } from "../lib/context";

export const readCompanyHistoryTool = tool({
    description:
        "Read the already-loaded company record, its contacts (with ids), and the workspace investment mandate. Free and always available.",
    inputSchema: z.object({}),
    contextSchema: z.custom<CompanyContext>(),
    execute: async (_input, { context }) => context,
});
