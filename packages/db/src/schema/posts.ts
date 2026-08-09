import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const posts = pgTable('posts', {
    id: text("id").primaryKey(),
    content: text().notNull(),
    ownerId: integer('owner_id'),
});
