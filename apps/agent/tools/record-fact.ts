import { tool } from "ai";
import { z } from "zod";
import { db, companies, agentEvents } from "db";
import { eq } from "drizzle-orm";

const FACT_FIELDS = [
    "industry",
    "subIndustry",
    "headquartersCountry",
    "headquartersState",
    "headquartersCity",
    "linkedinUrl",
    "phone",
    "generalEmail",
] as const;

type FactField = (typeof FACT_FIELDS)[number];

const FACT_SETTERS = {
    industry: (value: string) => ({ industry: value }),
    subIndustry: (value: string) => ({ subIndustry: value }),
    headquartersCountry: (value: string) => ({ headquartersCountry: value }),
    headquartersState: (value: string) => ({ headquartersState: value }),
    headquartersCity: (value: string) => ({ headquartersCity: value }),
    linkedinUrl: (value: string) => ({ linkedinUrl: value }),
    phone: (value: string) => ({ phone: value }),
    generalEmail: (value: string) => ({ generalEmail: value }),
} satisfies Record<FactField, (value: string) => Partial<typeof companies.$inferInsert>>;

const randomId = () => crypto.randomUUID();

export const recordFactTool = tool({
    description:
        "Record a fact about the company. High-confidence, evidence-backed facts are written directly; weaker facts are stored as proposals for human review.",
    inputSchema: z.object({
        field: z.enum(FACT_FIELDS),
        value: z.string(),
        evidence: z.string().describe("Source or justification for the fact"),
        confidence: z.number().min(0).max(1),
    }),
    contextSchema: z.object({
        taskId: z.string(),
        workspaceId: z.string(),
        entityId: z.string(),
    }),
    execute: async ({ field, value, evidence, confidence }, { context }) => {
        if (confidence >= 0.8) {
            await db
                .update(companies)
                .set(FACT_SETTERS[field](value))
                .where(eq(companies.id, context.entityId));
            return { status: "written", field, value };
        }
        await db.insert(agentEvents).values({
            id: randomId(),
            workspaceId: context.workspaceId,
            taskId: context.taskId,
            entityType: "company",
            entityId: context.entityId,
            kind: "proposal",
            payload: { field, value, evidence, confidence },
        });
        return { status: "proposed", field, value, confidence };
    },
});
