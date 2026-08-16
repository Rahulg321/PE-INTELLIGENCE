import { db } from "db";

export type CompanyContext = {
    company: {
        id: string;
        workspaceId: string;
        legalName: string | null;
        displayName: string;
        website: string | null;
        description: string | null;
        industry: string | null;
        subIndustry: string | null;
        headquartersCountry: string | null;
        headquartersState: string | null;
        headquartersCity: string | null;
        foundedYear: number | null;
        employeeCount: number | null;
        linkedinUrl: string | null;
        contacts: {
            id: string;
            firstName: string;
            lastName: string | null;
            title: string | null;
            email: string | null;
            linkedinUrl: string | null;
            isPrimary: boolean;
        }[];
    };
    mandate: {
        id: string;
        primaryGeography: string | null;
        targetGeographies: string[];
        investmentTypes: string[];
        minRevenue: number | null;
        maxRevenue: number | null;
        minEbitda: number | null;
        maxEbitda: number | null;
        sectors: { sector: string; type: string }[];
        criteria: { criterion: string; importance: string }[];
    } | null;
};

export async function loadCompanyContext(companyId: string): Promise<CompanyContext | null> {
    const company = await db.query.companies.findFirst({
        where: { id: companyId },
        with: { contacts: true },
    });
    if (!company) return null;

    const mandate = await db.query.investmentMandates.findFirst({
        where: { workspaceId: company.workspaceId },
        with: { sectors: true, criteria: true },
    });

    return {
        company: {
            id: company.id,
            workspaceId: company.workspaceId,
            legalName: company.legalName,
            displayName: company.displayName,
            website: company.website,
            description: company.description,
            industry: company.industry,
            subIndustry: company.subIndustry,
            headquartersCountry: company.headquartersCountry,
            headquartersState: company.headquartersState,
            headquartersCity: company.headquartersCity,
            foundedYear: company.foundedYear,
            employeeCount: company.employeeCount,
            linkedinUrl: company.linkedinUrl,
            contacts: company.contacts.map((c) => ({
                id: c.id,
                firstName: c.firstName,
                lastName: c.lastName,
                title: c.title,
                email: c.email,
                linkedinUrl: c.linkedinUrl,
                isPrimary: c.isPrimary,
            })),
        },
        mandate: mandate
            ? {
                id: mandate.id,
                primaryGeography: mandate.primaryGeography,
                targetGeographies: mandate.targetGeographies,
                investmentTypes: mandate.investmentTypes,
                minRevenue: mandate.minRevenue,
                maxRevenue: mandate.maxRevenue,
                minEbitda: mandate.minEbitda,
                maxEbitda: mandate.maxEbitda,
                sectors: mandate.sectors.map((s) => ({ sector: s.sector, type: s.type })),
                criteria: mandate.criteria.map((c) => ({
                    criterion: c.criterion,
                    importance: c.importance,
                })),
            }
            : null,
    };
}
