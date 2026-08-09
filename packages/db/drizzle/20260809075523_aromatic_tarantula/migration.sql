CREATE TABLE "accounts" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "firms" (
	"id" text PRIMARY KEY,
	"owner_user_id" text NOT NULL,
	"name" text NOT NULL,
	"website" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "investment_mandates" (
	"id" text PRIMARY KEY,
	"firm_id" text NOT NULL,
	"geography" text[] DEFAULT '{}'::text[] NOT NULL,
	"investment_types" text[] DEFAULT '{}'::text[] NOT NULL,
	"min_revenue" integer,
	"max_revenue" integer,
	"min_ebitda" integer,
	"max_ebitda" integer,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mandate_criteria" (
	"id" text PRIMARY KEY,
	"mandate_id" text NOT NULL,
	"criterion" text NOT NULL,
	"importance" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mandate_sectors" (
	"id" text PRIMARY KEY,
	"mandate_id" text NOT NULL,
	"sector" text NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"id" text PRIMARY KEY,
	"key" text NOT NULL UNIQUE,
	"count" integer NOT NULL,
	"last_request" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "accounts_userId_idx" ON "accounts" ("user_id");--> statement-breakpoint
CREATE INDEX "firms_ownerUserId_idx" ON "firms" ("owner_user_id");--> statement-breakpoint
CREATE INDEX "investment_mandates_firmId_idx" ON "investment_mandates" ("firm_id");--> statement-breakpoint
CREATE INDEX "mandate_criteria_mandateId_idx" ON "mandate_criteria" ("mandate_id");--> statement-breakpoint
CREATE INDEX "mandate_sectors_mandateId_idx" ON "mandate_sectors" ("mandate_id");--> statement-breakpoint
CREATE INDEX "sessions_userId_idx" ON "sessions" ("user_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" ("identifier");--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "firms" ADD CONSTRAINT "firms_owner_user_id_users_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "investment_mandates" ADD CONSTRAINT "investment_mandates_firm_id_firms_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "firms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "mandate_criteria" ADD CONSTRAINT "mandate_criteria_mandate_id_investment_mandates_id_fkey" FOREIGN KEY ("mandate_id") REFERENCES "investment_mandates"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "mandate_sectors" ADD CONSTRAINT "mandate_sectors_mandate_id_investment_mandates_id_fkey" FOREIGN KEY ("mandate_id") REFERENCES "investment_mandates"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;