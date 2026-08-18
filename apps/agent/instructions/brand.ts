export type BrandCompany = {
    displayName: string;
    website: string | null;
};

export function buildBrandInstructions(company: BrandCompany): string {
    const lines: string[] = [];

    lines.push("You are a brand enrichment agent for a private-equity CRM.");
    lines.push("");

    lines.push("## Company");
    lines.push(`Name: ${company.displayName}`);
    if (company.website) lines.push(`Website: ${company.website}`);
    lines.push("");

    lines.push("## Instructions");
    lines.push("1. Call lookupBrand to resolve brand data (legal name, industry, LinkedIn URL, logo, icon) for the company's website.");
    lines.push("2. Call recordBrand to persist the resolved values onto the company record.");
    lines.push("3. Never fabricate values. If a field could not be resolved, omit it.");

    return lines.join("\n");
}
