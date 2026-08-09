import { defineRelations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, integer, bigint, index } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const sessions = pgTable(
    "sessions",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
    },
    (table) => [index("sessions_userId_idx").on(table.userId)],
);

export const accounts = pgTable(
    "accounts",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("accounts_userId_idx").on(table.userId)],
);

export const verifications = pgTable(
    "verifications",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("verifications_identifier_idx").on(table.identifier)],
);

export const rateLimits = pgTable("rate_limits", {
    id: text("id").primaryKey(),
    key: text("key").notNull().unique(),
    count: integer("count").notNull(),
    lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});

export const firms = pgTable(
    "firms",
    {
        id: text("id").primaryKey(),
        ownerUserId: text("owner_user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        website: text("website"),
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

export const relations = defineRelations(
    { users, sessions, accounts, verifications, rateLimits, firms, investmentMandates, mandateSectors, mandateCriteria },
    (helpers) => ({
        users: {
            sessions: helpers.many.sessions({ from: [helpers.users.id], to: [helpers.sessions.userId] }),
            accounts: helpers.many.accounts({ from: [helpers.users.id], to: [helpers.accounts.userId] }),
            firms: helpers.many.firms({ from: [helpers.users.id], to: [helpers.firms.ownerUserId] }),
        },
        sessions: {
            users: helpers.one.users({ from: [helpers.sessions.userId], to: [helpers.users.id] }),
        },
        accounts: {
            users: helpers.one.users({ from: [helpers.accounts.userId], to: [helpers.users.id] }),
        },
        firms: {
            users: helpers.one.users({ from: [helpers.firms.ownerUserId], to: [helpers.users.id] }),
            investmentMandates: helpers.many.investmentMandates({ from: [helpers.firms.id], to: [helpers.investmentMandates.firmId] }),
        },
        investmentMandates: {
            firms: helpers.one.firms({ from: [helpers.investmentMandates.firmId], to: [helpers.firms.id] }),
            sectors: helpers.many.mandateSectors({ from: [helpers.investmentMandates.id], to: [helpers.mandateSectors.mandateId] }),
            criteria: helpers.many.mandateCriteria({ from: [helpers.investmentMandates.id], to: [helpers.mandateCriteria.mandateId] }),
        },
        mandateSectors: {
            investmentMandates: helpers.one.investmentMandates({ from: [helpers.mandateSectors.mandateId], to: [helpers.investmentMandates.id] }),
        },
        mandateCriteria: {
            investmentMandates: helpers.one.investmentMandates({ from: [helpers.mandateCriteria.mandateId], to: [helpers.investmentMandates.id] }),
        },
    }),
);
