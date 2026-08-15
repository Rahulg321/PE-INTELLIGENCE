CREATE TYPE "financial_period_type" AS ENUM('FISCAL_YEAR', 'QUARTER', 'LTM');--> statement-breakpoint
CREATE TYPE "deal_stage" AS ENUM('INITIAL_REVIEW', 'SCREENING', 'DILIGENCE', 'IC', 'LOI', 'CLOSING', 'CLOSED');--> statement-breakpoint
CREATE TYPE "deal_status" AS ENUM('NEW', 'ACTIVE', 'ON_HOLD', 'PASSED', 'LOST', 'WON');--> statement-breakpoint
CREATE TYPE "deal_type" AS ENUM('CONTROL_MAJORITY', 'MINORITY', 'BUYOUT', 'GROWTH', 'SPECIAL_SITUATIONS');--> statement-breakpoint
ALTER TABLE "firms" RENAME TO "workspaces";--> statement-breakpoint
ALTER INDEX "firms_ownerUserId_idx" RENAME TO "workspaces_ownerUserId_idx";--> statement-breakpoint
ALTER TABLE "workspaces" RENAME CONSTRAINT "firms_owner_user_id_users_id_fkey" TO "workspaces_owner_user_id_users_id_fkey";--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "slug" text;--> statement-breakpoint
WITH base AS (
	SELECT id,
		NULLIF(lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')), '') AS base_slug,
		row_number() OVER (PARTITION BY lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) ORDER BY created_at) AS rn
	FROM "workspaces"
)
UPDATE "workspaces" w
SET slug = COALESCE(NULLIF(b.base_slug, ''), 'workspace') || CASE WHEN b.rn > 1 THEN '-' || b.rn ELSE '' END
FROM base b
WHERE w.id = b.id;--> statement-breakpoint
ALTER TABLE "workspaces" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_slug_key" UNIQUE ("slug");--> statement-breakpoint
DROP INDEX "investment_mandates_firmId_idx";--> statement-breakpoint
ALTER TABLE "investment_mandates" DROP CONSTRAINT "investment_mandates_firm_id_firms_id_fkey";--> statement-breakpoint
ALTER TABLE "investment_mandates" RENAME COLUMN "firm_id" TO "workspace_id";--> statement-breakpoint
ALTER TABLE "investment_mandates" RENAME COLUMN "geography" TO "target_geographies";--> statement-breakpoint
ALTER TABLE "investment_mandates" ADD COLUMN "primary_geography" text;--> statement-breakpoint
UPDATE "investment_mandates" SET "primary_geography" = "target_geographies"[1];--> statement-breakpoint
CREATE UNIQUE INDEX "investment_mandates_workspaceId_idx" ON "investment_mandates" ("workspace_id");--> statement-breakpoint
ALTER TABLE "investment_mandates" ADD CONSTRAINT "investment_mandates_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
CREATE TABLE "companies" (
	"id" text PRIMARY KEY,
	"workspace_id" text NOT NULL,
	"legal_name" text,
	"display_name" text NOT NULL,
	"website" text,
	"description" text,
	"industry" text,
	"sub_industry" text,
	"headquarters_country" text,
	"headquarters_state" text,
	"headquarters_city" text,
	"founded_year" integer,
	"employee_count" integer,
	"linkedin_url" text,
	"phone" text,
	"general_email" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "company_financial_periods" (
	"id" text PRIMARY KEY,
	"company_id" text NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"period_type" "financial_period_type" NOT NULL,
	"revenue" numeric(18,2),
	"gross_profit" numeric(18,2),
	"ebitda" numeric(18,2),
	"ebitda_margin" numeric(7,4),
	"capex" numeric(18,2),
	"cash" numeric(18,2),
	"debt" numeric(18,2),
	"net_debt" numeric(18,2),
	"currency" text DEFAULT 'USD' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" text PRIMARY KEY,
	"company_id" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text,
	"title" text,
	"email" text,
	"phone" text,
	"linkedin_url" text,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
DROP TABLE "deals";--> statement-breakpoint
CREATE TABLE "deals" (
	"id" text PRIMARY KEY,
	"workspace_id" text NOT NULL,
	"company_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" "deal_status" DEFAULT 'NEW' NOT NULL,
	"stage" "deal_stage" DEFAULT 'INITIAL_REVIEW' NOT NULL,
	"deal_type" "deal_type",
	"source" text,
	"source_name" text,
	"announced_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "deal_economics" (
	"id" text PRIMARY KEY,
	"deal_id" text NOT NULL,
	"enterprise_value" numeric(18,2),
	"equity_purchase_price" numeric(18,2),
	"entry_ebitda" numeric(18,2),
	"cash_at_close" numeric(18,2),
	"debt_at_close" numeric(18,2),
	"debt_financing" numeric(18,2),
	"sponsor_equity" numeric(18,2),
	"seller_rollover" numeric(18,2),
	"other_equity" numeric(18,2),
	"transaction_fees" numeric(18,2),
	"financing_fees" numeric(18,2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX "companies_workspaceId_idx" ON "companies" ("workspace_id");--> statement-breakpoint
CREATE INDEX "companies_website_idx" ON "companies" ("website");--> statement-breakpoint
CREATE INDEX "company_financial_periods_companyId_idx" ON "company_financial_periods" ("company_id");--> statement-breakpoint
CREATE INDEX "contacts_companyId_idx" ON "contacts" ("company_id");--> statement-breakpoint
CREATE INDEX "deals_workspaceId_idx" ON "deals" ("workspace_id");--> statement-breakpoint
CREATE INDEX "deals_companyId_idx" ON "deals" ("company_id");--> statement-breakpoint
CREATE INDEX "deals_status_idx" ON "deals" ("status");--> statement-breakpoint
CREATE INDEX "deals_stage_idx" ON "deals" ("stage");--> statement-breakpoint
CREATE UNIQUE INDEX "deal_economics_dealId_idx" ON "deal_economics" ("deal_id");--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "company_financial_periods" ADD CONSTRAINT "company_financial_periods_company_id_companies_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_company_id_companies_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_company_id_companies_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "deal_economics" ADD CONSTRAINT "deal_economics_deal_id_deals_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE CASCADE;
