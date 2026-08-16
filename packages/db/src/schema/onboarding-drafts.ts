import { pgTable, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { users } from "./auth";

/** How much weight the firm puts on a single mandate criterion while still drafting. */
export type OnboardingCriterionImportance = "preferred" | "required";

/**
 * The in-progress onboarding wizard answers stored in `onboarding_drafts.data`.
 *
 * Every field mirrors a wizard input rather than the persisted mandate: numeric
 * amounts stay as the raw strings the user typed, and each field carries an empty
 * default so a partially filled draft is always a complete document.
 */
export type OnboardingDraftData = {
    firmName: string;
    website: string;
    geography: string[];
    investmentTypes: string[];
    minRevenue: string;
    maxRevenue: string;
    minEbitda: string;
    maxEbitda: string;
    preferredSectors: string[];
    excludedSectors: string[];
    noSectorPreference: boolean;
    criteria: Record<string, OnboardingCriterionImportance>;
    dealbreakers: string[];
};

export const onboardingDrafts = pgTable("onboarding_drafts", {
    userId: text("user_id")
        .primaryKey()
        .references(() => users.id, { onDelete: "cascade" }),
    data: jsonb("data").$type<OnboardingDraftData>().notNull(),
    step: integer("step").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});
