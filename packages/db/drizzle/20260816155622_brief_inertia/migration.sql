CREATE TYPE "enrichment_status" AS ENUM('PENDING', 'RUNNING', 'DONE');--> statement-breakpoint
CREATE TABLE "agent_events" (
	"id" text PRIMARY KEY,
	"workspace_id" text NOT NULL,
	"task_id" text,
	"entity_type" text,
	"entity_id" text,
	"kind" text NOT NULL,
	"step_number" integer,
	"payload" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agent_tasks" (
	"id" text PRIMARY KEY,
	"workspace_id" text NOT NULL,
	"kind" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"reason" text,
	"priority" integer DEFAULT 0 NOT NULL,
	"budget" integer DEFAULT 0 NOT NULL,
	"due_at" timestamp DEFAULT now() NOT NULL,
	"leased_until" timestamp,
	"started_at" timestamp,
	"attempts" integer DEFAULT 0 NOT NULL,
	"finished_at" timestamp,
	"outcome" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "logo_url" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "icon_url" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "enrichment_status" "enrichment_status" DEFAULT 'PENDING'::"enrichment_status" NOT NULL;--> statement-breakpoint
CREATE INDEX "agent_events_task_idx" ON "agent_events" ("task_id");--> statement-breakpoint
CREATE INDEX "agent_events_entity_idx" ON "agent_events" ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "agent_tasks_claim_idx" ON "agent_tasks" ("finished_at","due_at","priority");--> statement-breakpoint
CREATE INDEX "agent_tasks_entity_idx" ON "agent_tasks" ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "agent_tasks_workspace_idx" ON "agent_tasks" ("workspace_id");--> statement-breakpoint
ALTER TABLE "agent_events" ADD CONSTRAINT "agent_events_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "agent_events" ADD CONSTRAINT "agent_events_task_id_agent_tasks_id_fkey" FOREIGN KEY ("task_id") REFERENCES "agent_tasks"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "agent_tasks" ADD CONSTRAINT "agent_tasks_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;