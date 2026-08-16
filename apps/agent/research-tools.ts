import { tool } from "ai";
import { z } from "zod";
import { db, companies, agentEvents } from "db";
import { eq } from "drizzle-orm";
import type { AgentTask } from "./claim";
import type { CompanyContext } from "./research-context";

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

export function buildResearchTools(ctx: CompanyContext, task: AgentTask) {
    let budgetUsed = 0;
    const budget = task.budget;

    const readCompanyHistory = tool({
        description:
            "Read the already-loaded company record, its contacts (with ids), and the workspace investment mandate. Free and always available.",
        inputSchema: z.object({}),
        execute: async () => ctx,
    });

    const researchCompany = tool({
        description:
            "Perform a paid external lookup on the company. Each call consumes one unit of the task budget.",
        inputSchema: z.object({
            query: z.string().describe("What to look up externally"),
        }),
        execute: async ({ query }) => {
            if (budgetUsed >= budget) {
                return {
                    status: "budget_exhausted",
                    message:
                        "No paid lookups remaining. Rely on readCompanyHistory and facts you already have.",
                };
            }
            budgetUsed += 1;
            return {
                status: "ok",
                budgetRemaining: budget - budgetUsed,
                query,
                note: "External web research is not wired yet (stub). Do not fabricate; mark missing evidence in the brief.",
            };
        },
    });

    const recordFact = tool({
        description:
            "Record a fact about the company. High-confidence, evidence-backed facts are written directly; weaker facts are stored as proposals for human review.",
        inputSchema: z.object({
            field: z.enum(FACT_FIELDS),
            value: z.string(),
            evidence: z.string().describe("Source or justification for the fact"),
            confidence: z.number().min(0).max(1),
        }),
        execute: async ({ field, value, evidence, confidence }) => {
            if (confidence >= 0.8) {
                await db
                    .update(companies)
                    .set(FACT_SETTERS[field](value))
                    .where(eq(companies.id, task.entityId));
                return { status: "written", field, value };
            }
            await db.insert(agentEvents).values({
                id: randomId(),
                workspaceId: task.workspaceId,
                taskId: task.id,
                entityType: "company",
                entityId: task.entityId,
                kind: "proposal",
                payload: { field, value, evidence, confidence },
            });
            return { status: "proposed", field, value, confidence };
        },
    });

    const writeBrief = tool({
        description: "Write the final investment brief into the company description.",
        inputSchema: z.object({
            brief: z.string().describe("Concise brief including mandate fit and evidence gaps"),
        }),
        execute: async ({ brief }) => {
            await db
                .update(companies)
                .set({ description: brief })
                .where(eq(companies.id, task.entityId));
            return { status: "written" };
        },
    });

    return { readCompanyHistory, researchCompany, recordFact, writeBrief };
}
