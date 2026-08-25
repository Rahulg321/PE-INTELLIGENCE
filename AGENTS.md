# AGENTS.md

Bun workspace monorepo (turbo) for a TanStack Start + Better Auth + Drizzle product.

- **Apps** (`apps/`): `web` (main product — Vite + TanStack Start on Cloudflare Workers, port 3000), `frontend` (secondary TanStack Start app, port 3002), `agent` (Bun script: AI SDK + `@repo/ai` + `db`), `chat-agent` (Bun script: `chat` SDK + Slack adapter, port 3001).
- **Packages** (`packages/`): `auth` (`@repo/auth`, Better Auth), `db` (Drizzle + Postgres), `env` (`@repo/env`, root env loading), `ai` (`@repo/ai`, AI SDK config), `mail` (stub), `eslint-config` (`@repo/eslint-config`).
- All task orchestration runs through **Turborepo** — see "Turborepo build system & CI" below. Prefer root-level commands.

## Commands

Use **Bun**, not npm/pnpm (pinned in `devEngines`; see `packages/db/CLAUDE.md`). Prefer root-level turbo commands (see "Turborepo build system & CI"); run per-package commands when you only need one package.

- `bun run dev` — start all app dev servers concurrently (web :3000, frontend :3002, agent, chat-agent :3001). Ctrl+C stops them all.
- `bun run check-types` — typecheck **all** packages (web + frontend included) in parallel.
- `bun run test` — bun tests in `auth`, `env`, `chat-agent`.
- `bun run lint` — eslint in `web`, `auth`, `env`.
- `bun run build` — build `web` + `frontend` (deps first, cached).
- `bun run watch` — `turbo watch check-types`: re-typecheck affected packages on save.
- `bun run cf:deploy` / `cf:versions` — build → migrate → deploy flow (see Deploy below).
- Web dev (single app): `cd apps/web && bun --bun run dev` (port 3000). The `--bun` flag matters. Typecheck web alone: `cd apps/web && bunx tsc --noEmit`.
- Lint web: `cd apps/web && bun run lint`. Baseline is NOT clean — pre-existing errors in `src/components/ui/button.tsx`, `src/components/ui/alert.tsx`, `src/components/ui/sidebar.tsx` (`import/consistent-type-specifier-style`, plus `no-shadow` warnings in sidebar); don't treat these as yours. Root `turbo run lint` also fails on this baseline.
- Routes are auto-generated: `routeTree.gen.ts` is produced by `tsr generate`. Never hand-edit it.
- Env package (`packages/env`): `cd packages/env && bun test` (bun:test), `bun run check-types`, `bun run lint`. Lint is clean here.
- Auth package (`packages/auth`, `@repo/auth`): `cd packages/auth && bun test`, `bun run check-types`, `bun run lint`, and `DATABASE_URL=... bun run auth:generate` to regenerate the auth schema (see Auth section).

## Turborepo build system & CI

Root `turbo.json` is the single source of truth for task orchestration. Root scripts delegate via `turbo run <task>`; Turbo only runs a task in packages that define that script (a task with no matching script anywhere is a no-op). Turbo builds the package dependency graph, runs independent tasks in parallel, and caches results in `.turbo/cache` (gitignored).

**Tasks:**

| Task | Runs in | Cache | Notes |
|---|---|---|---|
| `transit` | — (no script) | — | Invisible dependency edge so `lint`/`check-types` run in parallel yet invalidate when a dependency's source changes. Never add a script named `transit`. |
| `build` | `web`, `frontend` | ✅ `dist/**`, `.wrangler/**` | `dependsOn: ["^build"]` — dependencies build first. Vite output. |
| `lint` | `web`, `auth`, `env` | ✅ | `dependsOn: ["transit"]`. Web baseline is red (see Commands). |
| `check-types` | all 7 packages | ✅ | `dependsOn: ["transit"]`. `tsc --noEmit`. |
| `test` | `auth`, `env`, `chat-agent` | ✅ | `bun test`. |
| `auth:generate` | `auth` | ✅ | `dependsOn: ["^auth:generate"]`; regenerates the Better Auth schema (see Auth). |
| `db:migrate:remote` | `db` | ❌ | Side-effecting remote migration. |
| `cf:deploy` | `web` | ❌ | `dependsOn: ["build", "db#db:migrate:remote"]` → migrate + build in parallel, then `wrangler deploy`. |
| `cf:versions` | `web` | ❌ | `dependsOn: ["build"]` → build, then `wrangler versions upload`. |
| `dev` | all 4 apps | ❌, `persistent: true` | Long-running dev servers — never cached (can't cache a running server), `persistent` so Turbo never waits for them to exit. |

**Global hash inputs** — `globalEnv` (8 vars: `NODE_ENV`, `DATABASE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `APP_URL`, `COOKIE_DOMAIN`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) and `globalDependencies: [".env*"]` are baked into every task's cache key. Changing one of these vars or the root `.env`/`.env.local` invalidates all caches. `outputLogs: "new-only"` on build/lint/check-types/test suppresses logs on cache hits (errors always shown).

**Day-to-day:**

- `bun run dev` — starts all 4 dev servers concurrently and streams their logs; Ctrl+C stops them. (Root script: `turbo run dev --filter="./apps/*"`.)
- `bun run watch` — `turbo watch check-types`: re-typechecks affected packages on save (handy while developing).
- `bun run check-types` / `test` / `lint` / `build` — one command covers every package that has the script; second run is `FULL TURBO` (all cache hits).

**Deploy flow:** `bun run cf:deploy` → Turbo runs `db#db:migrate:remote` + `pe-intelligence-web#build` (in parallel), then `wrangler deploy` in `web`. Ordering is Turbo-native — no cross-package `--cwd` pathing. `apps/web`'s `deploy` script is just `turbo run cf:deploy`. Local DB tooling (`db:generate`, `db:migrate`, `db:studio`) is **not** Turbo-registered — run it directly in `packages/db` (see Database section); only `db:migrate:remote` is wired into the deploy graph.

**Cloudflare Workers Builds (dashboard Git integration)** — `pe-intelligence-web` deploys on push to `main`. Critical gotcha: Workers Builds injects **build variables/secrets only into the build command**, never the deploy command. So migrations must run in the build command (where `DATABASE_URL_REMOTE` exists), and the deploy command must be a bare `wrangler deploy` — never `turbo run cf:deploy` (that re-runs `db:migrate:remote`, which fails in the deploy env). Current dashboard settings (Settings → Builds, root directory `/`):

- Build command: `bun install --frozen-lockfile && bunx turbo run db:migrate:remote build --filter=pe-intelligence-web...` (the `...` is required — it includes `db` in scope so migrations run)
- Deploy command: `cd apps/web && bunx wrangler deploy`
- Version command (non-production branches): `cd apps/web && bunx wrangler versions upload`
- `DATABASE_URL_REMOTE` is set as a **build variable** (not runtime) so migrations work during the build step. Runtime vars/secrets live in Settings → Variables & Secrets (they are never available at build time).
- **Turbo strict env mode gotcha:** turbo runs in strict mode and only passes vars declared in `turbo.json` to task processes. `DATABASE_URL_REMOTE` is declared on the `db:migrate:remote` task (`env: ["DATABASE_URL_REMOTE"]`) and `globalPassThroughEnv` carries `CI`/`WORKERS_CI*`. Any new build-only var must be declared there too or it'll silently not reach the script ("is not set" errors in Workers Builds).

This is separate from GitHub Actions CI (`.github/workflows/ci.yml`), which only validates and never deploys.

**CI (`.github/workflows/ci.yml`)** — triggers on push to `main` and any PR:

- Steps: checkout → `oven-sh/setup-bun@v2` (pinned `1.3.12`) → restore `.turbo/cache` via `actions/cache` (sha key + ref-prefixed restore keys) → `bun install --frozen-lockfile` → validate.
- **PR:** `bunx turbo run build test check-types --affected` — runs only changed packages **and their dependents** (compares against `main`); reuses cache from main/prior PRs.
- **main:** `bunx turbo run build test check-types` — full strict validation; writes the fresh cache that future PRs restore.
- Lint is intentionally excluded from CI (web baseline is red). No secrets needed — `build`/`test`/`check-types` don't execute env-reading code and `@repo/env` never throws on a missing `.env`.
- Remote cache (shared across machines/CI) is **not** configured — caches are local-only. Optional upgrade: `bunx turbo login && bunx turbo link` (Vercel) and add `TURBO_TOKEN`/`TURBO_TEAM` secrets to CI.

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
