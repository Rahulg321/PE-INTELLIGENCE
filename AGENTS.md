# AGENTS.md

Bun workspace monorepo (turbo) for a TanStack Start + Better Auth + Drizzle app. Only `apps/web` is real; `apps/docs` is stale create-turbo boilerplate and `apps/server` is empty. `packages/ui`, `packages/eslint-config`, `packages/typescript-config` are leftover scaffolds.

## Commands

Use **Bun**, not npm/pnpm (pinned in `devEngines`; see `packages/db/CLAUDE.md`).

- Web dev: `cd apps/web && bun --bun run dev` (port 3000). The `--bun` flag matters.
- Typecheck web: `cd apps/web && bunx tsc --noEmit`. Note root `turbo run check-types` does NOT cover `apps/web` (only `packages/auth`/`packages/env` define that script).
- Lint web: `cd apps/web && bun run lint`. Baseline is NOT clean — pre-existing errors in `src/components/ui/button.tsx`, `src/components/ui/alert.tsx`, `src/components/ui/sidebar.tsx` (`import/consistent-type-specifier-style`, plus `no-shadow` warnings in sidebar); don't treat these as yours.
- Routes are auto-generated: `routeTree.gen.ts` is produced by `tsr generate`. Never hand-edit it.
- Env package (`packages/env`): `cd packages/env && bun test` (bun:test), `bun run check-types`, `bun run lint`. Lint is clean here.
- Auth package (`packages/auth`, `@repo/auth`): `cd packages/auth && bun test`, `bun run check-types`, `bun run lint`, and `DATABASE_URL=... bun run auth:generate` to regenerate the auth schema (see Auth section).

## Shared env loading (`packages/env`, `@repo/env`)

- `@repo/env` loads the **single root `.env` then `.env.local`** (`.env.local` overrides) into `process.env` — there are **no per-package `.env` files**. Real process env always wins; missing files never throw; load is idempotent.
- Two entrypoints via package exports: `import "@repo/env/load"` (side-effect) and direct exports `findWorkspaceRoot`, `parseEnv`, `loadRootEnv` from `"@repo/env"`.
- Workspace root is found by walking up from `process.cwd()` to the nearest dir whose `package.json` has a `workspaces` field. No runtime deps (only `node:fs`/`node:path`).
- Consumers must add `"@repo/env": "workspace:*"` to their `package.json` and `import "@repo/env/load"` at the top of any module reading env (db client, auth, drizzle config, CLI entrypoints). Currently wired in: `packages/db/src/client.ts`, `packages/db/drizzle.config.ts`, `apps/web/src/lib/auth.ts`, `packages/auth/src/env.ts`.
- If a consumer can't find its env, the root `.env`/`.env.local` is missing — create them at the repo root (gitignored).

## Database (`packages/db`)

- Postgres 17 in Docker: `docker compose up -d` → container `pe-intelligence-db`, db `crm`, user/pass `postgres`/`postgres`, port 5432. URL: `postgres://postgres:postgres@localhost:5432/crm`.
- `src/index.ts` re-exports `src/client.ts` (the `db` `drizzle()` instance — created with `{ relations }`, keep that) and everything from `src/schema/`.
- **Schema is split per domain under `packages/db/src/schema/`** (repo convention): `auth.ts` (Better Auth tables `users`/`sessions`/`accounts`/`verifications` + `rate_limits`), `workspaces.ts` (`workspaces`, `investment_mandates`, `mandate_sectors`, `mandate_criteria`), `companies.ts` (`companies`, `contacts`, `company_financial_periods`), `deals.ts` (`deals`, `deal_economics`), `onboarding-drafts.ts`, plus `relations.ts` (all `defineRelations`) and `index.ts` (re-exports). Add new entities to a new per-domain file in `src/schema/`.
- **Primary domain model:** `User` → `Workspace` (`workspaces.ownerUserId`) → `InvestmentMandate` (1:1, `investment_mandates.workspace_id` unique). Workspace owns `Company` and `Deal`. `Company` is the business itself (facts); `Deal` is the investment opportunity (references exactly one `Company`); multiple deals per company over time. `Company` owns `Contact` and `CompanyFinancialPeriod` (historical operating financials); `Deal` owns `DealEconomics` (transaction-specific valuation/financing). Never store deal pricing on Company, nor company facts on Deal. Do not hard-code a firm's investment criteria into the schema — criteria live as rows in `mandate_criteria`/`mandate_sectors` per workspace.
- Drizzle is on the **v1 line (`1.0.0-rc.4`)**:
  - Relations use the new API: `defineRelations(...)` — the old `relations()` function does **not** exist in this version and will throw `relations is not a function` from drizzle-kit. Use `helpers.many.X({ from: [helpers.a.col], to: [helpers.b.col] })` / `helpers.one.X(...)` form, not `{ fields, references }`.
  - Uses the **v3 migration folder structure**: one folder per migration under `packages/db/drizzle/<timestamp>_<name>/` containing `migration.sql` + `snapshot.json`, with **no `meta/_journal.json`**. Don't expect the old layout.
- Migrations: `cd packages/db && bun run db:generate`, then `bun run db:migrate`, then `db:studio`. `drizzle.config.ts` imports `@repo/env/load` and reads `process.env.DATABASE_URL!` — with a root `.env` present it works from any cwd; otherwise pass it inline: `DATABASE_URL=postgres://postgres:postgres@localhost:5432/crm bun run db:migrate`.
- `packages/db/tsconfig.json` excludes `drizzle/` — the CLI writes `packages/db/drizzle/auth-schema.generated.ts` there (gitignored) as a regenerable artifact of `auth:generate`.
- If you change Better Auth plugins/providers, regenerate via `cd packages/auth && DATABASE_URL=... bun run auth:generate` (writes `../db/drizzle/auth-schema.generated.ts`), then reconcile the table changes into the `packages/db/src/schema/` files using the v1 `defineRelations` API. The CLI emits old-style `relations()` code and `bigint`/`uniqueIndex` differences; never copy its relations block verbatim. Then `cd packages/db && bun run db:generate && bun run db:migrate`.

## Auth (`packages/auth`, `@repo/auth`)

- **All Better Auth config lives in `packages/auth`** — apps compose `authOptions` from `@repo/auth` and add their framework plugin (hosts only, never in the package).
- Server config: `packages/auth/src/auth.ts` — `auth = betterAuth(authOptions)` with `drizzleAdapter(db, { provider: 'pg', schema, usePlural: true })`, `emailAndPassword.enabled: false`, Google social provider (only if `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` both set), account linking, 7-day sessions with `updateAge` + cookie cache, DB-backed rate limiting, `trustedOrigins`. **Single-tenant, no org/SSO plugins — anyone with a Google account can sign up.** Exports `auth`, `authOptions`, `type Auth`, `type Session`, `type SessionUser`. **No framework imports.**
- Hooks in `authOptions.databaseHooks`: `session.create.after` fires `notifySignedIn`.
- Server config host: `apps/web/src/lib/auth.ts` composes `authOptions` from `@repo/auth` + `tanstackStartCookies()` plugin.
- Client: `apps/web/src/features/auth/client.ts` re-exports `authClient` (and `getSession`/`signIn`/`signOut`/`useSession`) from `@repo/auth/client`.
- Route handler: `apps/web/src/routes/api/auth/$.ts` forwards GET/POST to `auth.handler(request)`.
- Helper modules (subpath exports of `@repo/auth`): `env` (frozen, from root env), `signed-in` (pub/sub), `cookies` (`cookiePrefix`).
- Onboarding: `apps/web/src/routes/onboarding.tsx` is a thin route (guarded by `beforeLoad`: unauthenticated → `/`, already-onboarded → `/dashboard`) rendering the 5-step wizard (create workspace → investment strategy → target sectors → investment preferences → review) from `apps/web/src/features/onboarding/components/onboarding-wizard.tsx` (steps are separate components in the same folder). Submits via `saveOnboarding` (`features/onboarding/server/mutations/save-onboarding.ts`, a `createServerFn` that checks the session then delegates to `onboardingService.save` in `features/onboarding/server/onboarding-service.ts`, which persists workspace + mandate + sectors + criteria in one `db.transaction`). `apps/web/src/routes/dashboard.tsx` (thin, renders `features/dashboard/components/dashboard-page.tsx`) shows the resulting mandate.
- Env (in **root `.env`/`.env.local`**, gitignored): `BETTER_AUTH_URL=http://localhost:3000`, `BETTER_AUTH_SECRET` (generate via `bunx --bun @better-auth/cli secret`), `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, optional `APP_URL`, `COOKIE_DOMAIN`, `NODE_ENV`. Google callback redirect URI: `http://localhost:3000/api/auth/callback/google`.
- Vite still loads `apps/web/.env*` for client-side `import.meta.env` (`VITE_*`) vars — those stay in `apps/web`, everything else lives at the root.
- Sanity check: `curl http://localhost:3000/api/auth/ok` → `{"ok":true}`.

## Conventions

- Imports in web use the `#/*` alias (`#/lib/auth`, `#/components/ui/button`) mapping to `./src/*`.
- Env files are gitignored; never commit `.env*`.

## Frontend structure (`apps/web/src`)

**Feature-first + thin routes.** `routes/` describes navigation (URL, `beforeLoad`, `loader`); `features/<domain>/` owns the business capability (UI, server fns, schemas, constants); `lib/` holds generic infra (`lib/auth.ts` = Better Auth host, `lib/utils.ts` = `cn`); `components/ui/` = shadcn primitives.

- **Keep routes thin.** A route file should be a shell: `createFileRoute` + `beforeLoad`/`loader` + `component: <FeatureComponent>`. No DB access, validation, or business logic in routes. Loader data flows into the feature component via a small route wrapper (see `routes/dashboard.tsx`).
- **Current feature domains:** `features/auth/` (components `login-page.tsx`/`signup-page.tsx`, session `client.ts`, server `get-session-user.ts` with `getSessionUser`, `server/queries/get-session-status.ts`), `features/onboarding/` (components `onboarding-wizard.tsx`, `schemas.ts`, `constants.ts`, server `onboarding-service.ts`, `queries/get-onboarding-status.ts`, `mutations/save-onboarding.ts`), `features/dashboard/` (components `dashboard-page.tsx`, server `dashboard-service.ts`, `queries/get-dashboard-data.ts`), `features/mcp/` (MCP server, todos, handler).
- **Server fns live next to their feature as thin boundaries.** Each feature has `server/queries/*` and `server/mutations/*` (the `createServerFn`s — they own auth via `authMiddleware`/`getSessionUser` and validation) which delegate persistence to `server/*-service.ts`. The service imports `db` from `db`; client components must never import `db` or `#/lib/auth`. Shared server helper: `getSessionUser` in `features/auth/server/get-session-user.ts`, gate `authMiddleware` in `features/auth/server/auth-middleware.ts`.
- **Kebab-case files; PascalCase component exports** (`onboarding-wizard.tsx` → `export function OnboardingWizard`).
- **Don't create folders prematurely.** Each feature gets `components/` + `server/{queries,mutations}` + `*-service.ts` from the start; don't add deeper nesting (e.g. `server/queries/nested/`) until a domain grows past ~10 ops. Same for `_auth`/`_dashboard` layout route groups (add when a second page under a layout appears).
- **Schema stays in `packages/db/src/schema/`** — never split it into per-feature schema files in the app.

## Architecture summary (layers)

Five layers; arrows only point down, never back up:

```
routes/ (apps/web/src/routes)            URL, guards, loaders — shells only
  → server fns (features/<d>/server)     auth + validation, thin boundary
  → service (features/<d>/server/*-service.ts)   business ops + persistence — the ONLY file that imports db
  → db package (packages/db)             schema, relations, client
  → PostgreSQL
```

| Concern | Location |
|---|---|
| Tables/relations | `packages/db/src/schema/*.ts` + `relations.ts` + `index.ts` |
| Drizzle client | `packages/db/src/client.ts` (`db = drizzle(URL, { relations })`) |
| SQL queries/mutations | `features/<domain>/server/*-service.ts` — never in `packages/db`, never in components |
| Server fns (reads) | `features/<domain>/server/queries/*.ts` |
| Server fns (writes) | `features/<domain>/server/mutations/*.ts` |
| Feature UI | `features/<domain>/components/*.tsx` |
| Domain code | `features/<domain>/helpers.ts`, `constants.ts`, `schemas.ts`, `types.ts` |
| Generic app UI | `apps/web/src/components/shared/` |
| Shadcn primitives | `apps/web/src/components/ui/` |
| Generic utils / infra | `apps/web/src/lib/utils.ts` (`cn`), `lib/auth.ts` (Better Auth host), future `lib/storage|ai|email` |
| Framework bootstrap | `apps/web/src/router.tsx`, `routeTree.gen.ts` (generated) |

**Invariants**
- Only `*-service.ts` touches `db`; components, routes, and server fns never import it.
- Server fns are thin: `authMiddleware`/`getSessionUser()` (from `features/auth/server/`) + zod validator + delegate to the service.
- Routes are shells; loader data flows into components via a small route wrapper (see `routes/dashboard.tsx`).
- `packages/db` never imports app code or `@repo/*` (only `@repo/env/load` for env).
- Shared code climbs: used by 2+ features → `components/shared/` or `lib/`; used by 1 feature → stays in the feature.
- Layout groups (`_auth`, `_dashboard`) and deeper server nesting are added only when they earn it (~2nd page, ~10 ops).
