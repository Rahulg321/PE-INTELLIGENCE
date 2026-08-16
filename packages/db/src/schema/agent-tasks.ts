import { pgTable, text, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

export const agentTasks = pgTable(
    "agent_tasks",
    {
        id: text("id").primaryKey(),
        workspaceId: text("workspace_id")
            .notNull()
            .references(() => workspaces.id, { onDelete: "cascade" }),
        kind: text("kind").notNull(),
        entityType: text("entity_type").notNull(),
        entityId: text("entity_id").notNull(),
        reason: text("reason"),
        priority: integer("priority").notNull().default(0),
        budget: integer("budget").notNull().default(0),
        dueAt: timestamp("due_at").defaultNow().notNull(),
        leasedUntil: timestamp("leased_until"),
        startedAt: timestamp("started_at"),
        attempts: integer("attempts").notNull().default(0),
        finishedAt: timestamp("finished_at"),
        outcome: text("outcome"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("agent_tasks_claim_idx").on(table.finishedAt, table.dueAt, table.priority),
        index("agent_tasks_entity_idx").on(table.entityType, table.entityId),
        index("agent_tasks_workspace_idx").on(table.workspaceId),
    ],
);

export const agentEvents = pgTable(
    "agent_events",
    {
        id: text("id").primaryKey(),
        workspaceId: text("workspace_id")
            .notNull()
            .references(() => workspaces.id, { onDelete: "cascade" }),
        taskId: text("task_id").references(() => agentTasks.id, { onDelete: "cascade" }),
        entityType: text("entity_type"),
        entityId: text("entity_id"),
        kind: text("kind").notNull(),
        stepNumber: integer("step_number"),
        payload: jsonb("payload").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("agent_events_task_idx").on(table.taskId),
        index("agent_events_entity_idx").on(table.entityType, table.entityId),
    ],
);
