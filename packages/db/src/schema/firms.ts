import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const firms = pgTable(
    "firms",
    {
        id: text("id").primaryKey(),
        ownerUserId: text("owner_user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        website: text("website"),
        onboardedAt: timestamp("onboarded_at"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("firms_ownerUserId_idx").on(table.ownerUserId)],
);

export const investmentMandates = pgTable(
    "investment_mandates",
    {
        id: text("id").primaryKey(),
        firmId: text("firm_id")
            .notNull()
            .references(() => firms.id, { onDelete: "cascade" }),
        geography: text("geography").array().notNull().default([]),
        investmentTypes: text("investment_types").array().notNull().default([]),
        minRevenue: integer("min_revenue"),
        maxRevenue: integer("max_revenue"),
        minEbitda: integer("min_ebitda"),
        maxEbitda: integer("max_ebitda"),
        version: integer("version").notNull().default(1),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("investment_mandates_firmId_idx").on(table.firmId)],
);

export const mandateSectors = pgTable(
    "mandate_sectors",
    {
        id: text("id").primaryKey(),
        mandateId: text("mandate_id")
            .notNull()
            .references(() => investmentMandates.id, { onDelete: "cascade" }),
        sector: text("sector").notNull(),
        type: text("type", { enum: ["preferred", "excluded"] }).notNull(),
    },
    (table) => [index("mandate_sectors_mandateId_idx").on(table.mandateId)],
);

export const mandateCriteria = pgTable(
    "mandate_criteria",
    {
        id: text("id").primaryKey(),
        mandateId: text("mandate_id")
            .notNull()
            .references(() => investmentMandates.id, { onDelete: "cascade" }),
        criterion: text("criterion").notNull(),
        importance: text("importance", { enum: ["required", "preferred", "neutral"] }).notNull(),
    },
    (table) => [index("mandate_criteria_mandateId_idx").on(table.mandateId)],
);
