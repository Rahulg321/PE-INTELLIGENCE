ALTER TABLE "investment_mandates" ADD COLUMN "no_sector_preference" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "deleted_by" text;--> statement-breakpoint
CREATE INDEX "workspaces_deletedAt_idx" ON "workspaces" ("deleted_at");--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_deleted_by_users_id_fkey" FOREIGN KEY ("deleted_by") REFERENCES "users"("id");