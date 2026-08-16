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

    await db
        .update(companies)
        .set({
            ...(look.legalName ? { legalName: look.legalName } : {}),
            ...(look.industry ? { industry: look.industry } : {}),
            ...(look.linkedinUrl ? { linkedinUrl: look.linkedinUrl } : {}),
            ...(look.logoUrl ? { logoUrl: look.logoUrl } : {}),
            ...(look.iconUrl ? { iconUrl: look.iconUrl } : {}),
        })
        .where(eq(companies.id, task.entityId));

    return look.logoUrl ? "logo resolved" : "no brand data found";
}
