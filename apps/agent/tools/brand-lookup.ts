import { tool } from "ai";
import { z } from "zod";

export type BrandLookup = {
    legalName: string | null;
    industry: string | null;
    linkedinUrl: string | null;
    logoUrl: string | null;
    iconUrl: string | null;
};

function lookupBrand(website: string | null): BrandLookup {
    // TODO: swap this placeholder for a real vendor (e.g. Clearbit company API).
    if (!website) {
        return { legalName: null, industry: null, linkedinUrl: null, logoUrl: null, iconUrl: null };
    }

    let domain: string;
    try {
        domain = new URL(website.startsWith("http") ? website : `https://${website}`).hostname;
    } catch {
        return { legalName: null, industry: null, linkedinUrl: null, logoUrl: null, iconUrl: null };
    }

    const logoUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
    return { legalName: null, industry: null, linkedinUrl: null, logoUrl, iconUrl: logoUrl };
}

export const lookupBrandTool = tool({
    description:
        "Look up brand data for the company's website: legal name, industry, LinkedIn URL, logo, and icon.",
    inputSchema: z.object({}),
    contextSchema: z.object({
        website: z.string().nullable(),
    }),
    execute: async (_input, { context }) => {
        return lookupBrand(context.website);
    },
});
