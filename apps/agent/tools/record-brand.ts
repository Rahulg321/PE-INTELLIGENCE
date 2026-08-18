import { tool } from "ai";
import { z } from "zod";
import { db, companies } from "db";
import { eq } from "drizzle-orm";

export const recordBrandTool = tool({
    description: "Record resolved brand information onto the company record.",
    inputSchema: z.object({
        legalName: z.string().nullish(),
        industry: z.string().nullish(),
        linkedinUrl: z.string().nullish(),
        logoUrl: z.string().nullish(),
        iconUrl: z.string().nullish(),
    }),
    contextSchema: z.object({
        entityId: z.string(),
    }),
    execute: async ({ legalName, industry, linkedinUrl, logoUrl, iconUrl }, { context }) => {
        const updates: Partial<typeof companies.$inferInsert> = {};
        if (legalName) updates.legalName = legalName;
        if (industry) updates.industry = industry;
        if (linkedinUrl) updates.linkedinUrl = linkedinUrl;
        if (logoUrl) updates.logoUrl = logoUrl;
        if (iconUrl) updates.iconUrl = iconUrl;

        if (Object.keys(updates).length > 0) {
            await db
                .update(companies)
                .set(updates)
                .where(eq(companies.id, context.entityId));
        }

        return { status: "written", updated: Object.keys(updates) };
    },
});
