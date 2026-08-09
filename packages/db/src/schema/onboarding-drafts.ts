import { pgTable, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const onboardingDrafts = pgTable("onboarding_drafts", {
    userId: text("user_id")
        .primaryKey()
        .references(() => users.id, { onDelete: "cascade" }),
    data: jsonb("data").$type<Record<string, unknown>>().notNull(),
    step: integer("step").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});
