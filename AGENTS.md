# AGENTS.md

Bun workspace monorepo (turbo) for a TanStack Start + Better Auth + Drizzle app. Only `apps/web` is real; `apps/docs` is stale create-turbo boilerplate and `apps/server` is empty. `packages/ui`, `packages/eslint-config`, `packages/typescript-config` are leftover scaffolds.

## Commands

Use **Bun**, not npm/pnpm (pinned in `devEngines`; see `packages/db/CLAUDE.md`).

- Web dev: `cd apps/web && bun --bun run dev` (port 3000). The `--bun` flag matters.
- Typecheck web: `cd apps/web && bunx tsc --noEmit`. Note root `turbo run check-types` does NOT cover `apps/web` (only `packages/ui` defines that script).
- Lint web: `cd apps/web && bun run lint`. Baseline is NOT clean — pre-existing errors in `src/components/ui/button.tsx` (`import/consistent-type-specifier-style`) and `src/integrations/better-auth/header-user.tsx` (`no-unnecessary-condition`); don't treat these as yours.
- Routes are auto-generated: `routeTree.gen.ts` is produced by `tsr generate`. Never hand-edit it.

## Database (`packages/db`)

- Postgres 17 in Docker: `docker compose up -d` → container `pe-intelligence-db`, db `crm`, user/pass `postgres`/`postgres`, port 5432. URL: `postgres://postgres:postgres@localhost:5432/crm`.
- `index.ts` exports `db` (a `drizzle()` instance) and re-exports the schema. `db` is created with `{ relations }` — keep that.
- **All schema lives in a single file `packages/db/schema.ts`** (repo convention — do not split into multiple schema files). It holds the Better Auth tables (`users`, `sessions`, `accounts`, `verifications`) plus `relations`.
- Drizzle is on the **v1 line (`1.0.0-rc.4`)**:
  - Relations use the new API: `defineRelations(...)` — the old `relations()` function does **not** exist in this version and will throw `relations is not a function` from drizzle-kit. Use `helpers.many.X({ from: [helpers.a.col], to: [helpers.b.col] })` / `helpers.one.X(...)` form, not `{ fields, references }`.
  - Uses the **v3 migration folder structure**: one folder per migration under `packages/db/drizzle/<timestamp>_<name>/` containing `migration.sql` + `snapshot.json`, with **no `meta/_journal.json`**. Don't expect the old layout.
- Migrations: `cd packages/db && bun run db:generate`, then `bun run db:migrate`, then `db:studio`. The config (`drizzle.config.ts`) imports `dotenv/config` and reads `process.env.DATABASE_URL!` — it only picks up a `.env` in `packages/db`, not `apps/web/.env.local`, so pass it inline:
  `DATABASE_URL=postgres://postgres:postgres@localhost:5432/crm bun run db:migrate`
- If you change Better Auth plugins/providers, the auth tables come from `bunx --bun @better-auth/cli@latest generate` — but that emits old-style `relations()` code and plural tables; reconcile the output into `schema.ts` using the v1 API (see above). The generated migration may conflict with existing tables; regenerate the migration folder if it collides.

## Auth (Better Auth)

- Server config: `apps/web/src/lib/auth.ts` — `drizzleAdapter(db, { provider: 'pg', schema: {...}, usePlural: true })`, email/password enabled, Google social provider, `tanstackStartCookies()` plugin.
- Client: `apps/web/src/lib/auth-client.ts` (`createAuthClient` from `better-auth/react`).
- Route handler: `apps/web/src/routes/api/auth/$.ts` forwards GET/POST to `auth.handler(request)`.
- Env (in `apps/web/.env.local`, gitignored): `BETTER_AUTH_URL=http://localhost:3000`, `BETTER_AUTH_SECRET` (generate via `bunx --bun @better-auth/cli secret`), `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. Google callback redirect URI: `http://localhost:3000/api/auth/callback/google`.
- Sanity check: `curl http://localhost:3000/api/auth/ok` → `{"ok":true}`.

## Conventions

- Imports in web use the `#/*` alias (`#/lib/auth`, `#/components/ui/button`) mapping to `./src/*`.
- Env files are gitignored; never commit `.env*`.
