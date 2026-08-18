import { tool } from "ai";
import { z } from "zod";
import { db, companies } from "db";
import { eq } from "drizzle-orm";

export const writeBriefTool = tool({
    description: "Write the final investment brief into the company description.",
    inputSchema: z.object({
        brief: z.string().describe("Concise brief including mandate fit and evidence gaps"),
    }),
    contextSchema: z.object({
        entityId: z.string(),
    }),
    execute: async ({ brief }, { context }) => {
        await db
            .update(companies)
            .set({ description: brief })
            .where(eq(companies.id, context.entityId));
        return { status: "written" };
    },
});
