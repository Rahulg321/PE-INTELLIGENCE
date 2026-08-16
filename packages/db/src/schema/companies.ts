import { pgTable, text, timestamp, integer, numeric, boolean, date, index, pgEnum } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

export const financialPeriodTypeEnum = pgEnum("financial_period_type", [
    "FISCAL_YEAR",
    "QUARTER",
    "LTM",
]);

export const enrichmentStatusEnum = pgEnum("enrichment_status", [
    "PENDING",
    "RUNNING",
    "DONE",
]);

export const companies = pgTable(
    "companies",
    {
        id: text("id").primaryKey(),
        workspaceId: text("workspace_id")
            .notNull()
            .references(() => workspaces.id, { onDelete: "cascade" }),
        legalName: text("legal_name"),
        displayName: text("display_name").notNull(),
        website: text("website"),
        description: text("description"),
        industry: text("industry"),
        subIndustry: text("sub_industry"),
        headquartersCountry: text("headquarters_country"),
        headquartersState: text("headquarters_state"),
        headquartersCity: text("headquarters_city"),
        foundedYear: integer("founded_year"),
        employeeCount: integer("employee_count"),
        linkedinUrl: text("linkedin_url"),
        phone: text("phone"),
        generalEmail: text("general_email"),
        logoUrl: text("logo_url"),
        iconUrl: text("icon_url"),
        enrichmentStatus: enrichmentStatusEnum("enrichment_status")
            .notNull()
            .default("PENDING"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("companies_workspaceId_idx").on(table.workspaceId),
        index("companies_website_idx").on(table.website),
    ],
);

export const contacts = pgTable(
    "contacts",
    {
        id: text("id").primaryKey(),
        companyId: text("company_id")
            .notNull()
            .references(() => companies.id, { onDelete: "cascade" }),
        firstName: text("first_name").notNull(),
        lastName: text("last_name"),
        title: text("title"),
        email: text("email"),
        phone: text("phone"),
        linkedinUrl: text("linkedin_url"),
        isPrimary: boolean("is_primary").notNull().default(false),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("contacts_companyId_idx").on(table.companyId)],
);

export const companyFinancialPeriods = pgTable(
    "company_financial_periods",
    {
        id: text("id").primaryKey(),
        companyId: text("company_id")
            .notNull()
            .references(() => companies.id, { onDelete: "cascade" }),
        periodStart: date("period_start", { mode: "date" }).notNull(),
        periodEnd: date("period_end", { mode: "date" }).notNull(),
        periodType: financialPeriodTypeEnum("period_type").notNull(),
        revenue: numeric("revenue", { precision: 18, scale: 2 }),
        grossProfit: numeric("gross_profit", { precision: 18, scale: 2 }),
        ebitda: numeric("ebitda", { precision: 18, scale: 2 }),
        ebitdaMargin: numeric("ebitda_margin", { precision: 7, scale: 4 }),
        capex: numeric("capex", { precision: 18, scale: 2 }),
        cash: numeric("cash", { precision: 18, scale: 2 }),
        debt: numeric("debt", { precision: 18, scale: 2 }),
        netDebt: numeric("net_debt", { precision: 18, scale: 2 }),
        currency: text("currency").notNull().default("USD"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("company_financial_periods_companyId_idx").on(table.companyId)],
);
