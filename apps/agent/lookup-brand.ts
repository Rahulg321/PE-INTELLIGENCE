export type BrandLookup = {
    legalName: string | null;
    industry: string | null;
    linkedinUrl: string | null;
    logoUrl: string | null;
    iconUrl: string | null;
};

export async function lookupBrand(website: string | null): Promise<BrandLookup> {
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
