import { tool } from "ai";
import { z } from "zod";

export const researchCompanyTool = tool({
    description: "Perform an external lookup on the company.",
    inputSchema: z.object({
        query: z.string().describe("What to look up externally"),
    }),
    execute: async ({ query }) => {
        return {
            status: "ok",
            query,
            note: "External web research is not wired yet (stub). Do not fabricate; mark missing evidence in the brief.",
        };
    },
});
