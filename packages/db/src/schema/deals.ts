import { pgTable, text, timestamp, numeric, index, uniqueIndex, pgEnum } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { companies } from "./companies";

export const dealStatusEnum = pgEnum("deal_status", [
    "NEW",
    "ACTIVE",
    "ON_HOLD",
    "PASSED",
    "LOST",
    "WON",
]);

export const dealStageEnum = pgEnum("deal_stage", [
    "INITIAL_REVIEW",
    "SCREENING",
    "DILIGENCE",
    "IC",
    "LOI",
    "CLOSING",
    "CLOSED",
]);

export const dealTypeEnum = pgEnum("deal_type", [
    "CONTROL_MAJORITY",
    "MINORITY",
    "BUYOUT",
    "GROWTH",
    "SPECIAL_SITUATIONS",
]);

export const deals = pgTable(
    "deals",
    {
        id: text("id").primaryKey(),
        workspaceId: text("workspace_id")
            .notNull()
            .references(() => workspaces.id, { onDelete: "cascade" }),
        companyId: text("company_id")
            .notNull()
            .references(() => companies.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        description: text("description"),
        status: dealStatusEnum("status").notNull().default("NEW"),
        stage: dealStageEnum("stage").notNull().default("INITIAL_REVIEW"),
        dealType: dealTypeEnum("deal_type"),
        source: text("source"),
        sourceName: text("source_name"),
        announcedDate: timestamp("announced_date"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("deals_workspaceId_idx").on(table.workspaceId),
        index("deals_companyId_idx").on(table.companyId),
        index("deals_status_idx").on(table.status),
        index("deals_stage_idx").on(table.stage),
    ],
);

export const dealEconomics = pgTable(
    "deal_economics",
    {
        id: text("id").primaryKey(),
        dealId: text("deal_id")
            .notNull()
            .references(() => deals.id, { onDelete: "cascade" }),
        enterpriseValue: numeric("enterprise_value", { precision: 18, scale: 2 }),
        equityPurchasePrice: numeric("equity_purchase_price", { precision: 18, scale: 2 }),
        entryEbitda: numeric("entry_ebitda", { precision: 18, scale: 2 }),
        cashAtClose: numeric("cash_at_close", { precision: 18, scale: 2 }),
        debtAtClose: numeric("debt_at_close", { precision: 18, scale: 2 }),
        debtFinancing: numeric("debt_financing", { precision: 18, scale: 2 }),
        sponsorEquity: numeric("sponsor_equity", { precision: 18, scale: 2 }),
        sellerRollover: numeric("seller_rollover", { precision: 18, scale: 2 }),
        otherEquity: numeric("other_equity", { precision: 18, scale: 2 }),
        transactionFees: numeric("transaction_fees", { precision: 18, scale: 2 }),
        financingFees: numeric("financing_fees", { precision: 18, scale: 2 }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [uniqueIndex("deal_economics_dealId_idx").on(table.dealId)],
);
