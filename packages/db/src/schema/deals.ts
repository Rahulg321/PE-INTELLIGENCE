import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const deals = pgTable(
    "deals",
    {
        id: text("id").primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        description: text("description").notNull(),
        amount: integer("amount").notNull(),
        date: timestamp("date").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("deals_userId_idx").on(table.userId)],
);
