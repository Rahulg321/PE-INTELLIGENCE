import { db, companies } from "db";
import { eq } from "drizzle-orm";
import type { AgentTask } from "./claim";
import { lookupBrand } from "./lookup-brand";

export async function runBrandLane(task: AgentTask): Promise<string> {
    const company = await db.query.companies.findFirst({
        where: { id: task.entityId },
        columns: { id: true, website: true },
    });
    if (!company) return "company not found";

    const look = await lookupBrand(company.website);

    const updates: Partial<typeof companies.$inferInsert> = {};
    if (look.legalName) updates.legalName = look.legalName;
    if (look.industry) updates.industry = look.industry;
    if (look.linkedinUrl) updates.linkedinUrl = look.linkedinUrl;
    if (look.logoUrl) updates.logoUrl = look.logoUrl;
    if (look.iconUrl) updates.iconUrl = look.iconUrl;

    await db.update(companies).set(updates).where(eq(companies.id, task.entityId));

    return look.logoUrl ? "logo resolved" : "no brand data found";
}
