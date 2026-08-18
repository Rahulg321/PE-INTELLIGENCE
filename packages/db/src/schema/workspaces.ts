import { pgTable, text, timestamp, integer, index, uniqueIndex, boolean } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const workspaces = pgTable(
    "workspaces",
    {
        id: text("id").primaryKey(),
        ownerUserId: text("owner_user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        slug: text("slug").notNull().unique(),
        website: text("website"),
        contextApiKey: text("context_api_key"),
        researchModel: text("research_model"),
        deletedAt: timestamp("deleted_at"),
        deletedBy: text("deleted_by").references(() => users.id),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("workspaces_ownerUserId_idx").on(table.ownerUserId),
        index("workspaces_deletedAt_idx").on(table.deletedAt),
    ],
);

export const investmentMandates = pgTable(
    "investment_mandates",
    {
        id: text("id").primaryKey(),
        workspaceId: text("workspace_id")
            .notNull()
            .references(() => workspaces.id, { onDelete: "cascade" }),
        primaryGeography: text("primary_geography"),
        targetGeographies: text("target_geographies").array().notNull().default([]),
        investmentTypes: text("investment_types").array().notNull().default([]),
        minRevenue: integer("min_revenue"),
        maxRevenue: integer("max_revenue"),
        minEbitda: integer("min_ebitda"),
        maxEbitda: integer("max_ebitda"),
        noSectorPreference: boolean("no_sector_preference").notNull().default(false),
        version: integer("version").notNull().default(1),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [uniqueIndex("investment_mandates_workspaceId_idx").on(table.workspaceId)],
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
        importance: text("importance", { enum: ["required", "preferred", "neutral", "dealbreaker"] }).notNull(),
    },
    (table) => [index("mandate_criteria_mandateId_idx").on(table.mandateId)],
);
