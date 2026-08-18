import type { CompanyContext } from "../lib/context";

const fmtBand = (min: number | null, max: number | null) => {
    if (min == null && max == null) return "not specified";
    if (min != null && max != null) return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
    if (min != null) return `$${min.toLocaleString()}+`;
    return `up to $${max?.toLocaleString()}`;
};

export function buildCompanyProfileInstructions(ctx: CompanyContext): string {
    const { company, mandate } = ctx;
    const lines: string[] = [];

    lines.push("You are a private-equity research agent.");
    lines.push("");

    lines.push("## Company");
    lines.push(`Name: ${company.displayName}`);
    if (company.legalName) lines.push(`Legal name: ${company.legalName}`);
    if (company.website) lines.push(`Website: ${company.website}`);
    if (company.industry) lines.push(`Known industry: ${company.industry}`);
    if (company.description) lines.push(`Existing brief: ${company.description}`);
    lines.push("");

    lines.push("## Contacts (with ids)");
    if (company.contacts.length === 0) {
        lines.push("(none)");
    } else {
        for (const c of company.contacts) {
            const name = [c.firstName, c.lastName].filter(Boolean).join(" ");
            lines.push(
                `- id=${c.id} | ${name}${c.title ? ` | ${c.title}` : ""}${c.email ? ` | ${c.email}` : ""}${c.linkedinUrl ? ` | ${c.linkedinUrl}` : ""}`,
            );
        }
    }
    lines.push("");

    lines.push("## Investment mandate (the firm you are screening for)");
    if (!mandate) {
        lines.push("(no mandate configured)");
    } else {
        if (mandate.primaryGeography) lines.push(`Geography: ${mandate.primaryGeography}`);
        if (mandate.targetGeographies.length > 0) {
            lines.push(`Target geographies: ${mandate.targetGeographies.join(", ")}`);
        }
        if (mandate.investmentTypes.length > 0) {
            lines.push(`Investment types: ${mandate.investmentTypes.join(", ")}`);
        }
        lines.push(`Revenue band: ${fmtBand(mandate.minRevenue, mandate.maxRevenue)}`);
        lines.push(`EBITDA band: ${fmtBand(mandate.minEbitda, mandate.maxEbitda)}`);
        if (mandate.sectors.length > 0) {
            const preferred = mandate.sectors.filter((s) => s.type === "preferred").map((s) => s.sector);
            const excluded = mandate.sectors.filter((s) => s.type === "excluded").map((s) => s.sector);
            if (preferred.length > 0) lines.push(`Preferred sectors: ${preferred.join(", ")}`);
            if (excluded.length > 0) lines.push(`Excluded sectors: ${excluded.join(", ")}`);
        }
        if (mandate.criteria.length > 0) {
            lines.push("Criteria:");
            for (const c of mandate.criteria) {
                lines.push(`- ${c.criterion} (${c.importance})`);
            }
        }
    }
    lines.push("");

    lines.push("## Instructions");
    lines.push("1. Call readCompanyHistory first to see everything the firm already knows.");
    lines.push("2. Use researchCompany for external lookups only when you cannot answer from known data.");
    lines.push("3. Use recordFact to persist facts you are confident about, always providing evidence and a confidence score (0-1). Weak facts are recorded as proposals for human review.");
    lines.push("4. Finish with writeBrief: a concise investment brief that states whether the company fits the mandate and why.");
    lines.push("5. Never fabricate facts. If evidence is missing, say so in the brief rather than inventing values.");

    return lines.join("\n");
}
