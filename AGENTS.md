# AGENTS.md

Bun workspace monorepo (turbo) for a TanStack Start + Better Auth + Drizzle app. Only `apps/web` is real; `apps/docs` is stale create-turbo boilerplate and `apps/server` is empty. `packages/ui`, `packages/eslint-config`, `packages/typescript-config` are leftover scaffolds.

## Commands

Use **Bun**, not npm/pnpm (pinned in `devEngines`; see `packages/db/CLAUDE.md`).

- Web dev: `cd apps/web && bun --bun run dev` (port 3000). The `--bun` flag matters.
- Typecheck web: `cd apps/web && bunx tsc --noEmit`. Note root `turbo run check-types` does NOT cover `apps/web` (only `packages/ui` defines that script).
- Lint web: `cd apps/web && bun run lint`. Baseline is NOT clean — pre-existing errors in `src/components/ui/button.tsx` (`import/consistent-type-specifier-style`) and `src/integrations/better-auth/header-user.tsx` (`no-unnecessary-condition`); don't treat these as yours.
- Routes are auto-generated: `routeTree.gen.ts` is produced by `tsr generate`. Never hand-edit it.
- Env package (`packages/env`): `cd packages/env && bun test` (bun:test), `bun run check-types`, `bun run lint`. Lint is clean here.
- Auth package (`packages/auth`, `@repo/auth`): `cd packages/auth && bun test`, `bun run check-types`, `bun run lint`, and `DATABASE_URL=... bun run auth:generate` to regenerate the auth schema (see Auth section).

## Shared env loading (`packages/env`, `@repo/env`)

- `@repo/env` loads the **single root `.env` then `.env.local`** (`.env.local` overrides) into `process.env` — there are **no per-package `.env` files**. Real process env always wins; missing files never throw; load is idempotent.
- Two entrypoints via package exports: `import "@repo/env/load"` (side-effect) and direct exports `findWorkspaceRoot`, `parseEnv`, `loadRootEnv` from `"@repo/env"`.
- Workspace root is found by walking up from `process.cwd()` to the nearest dir whose `package.json` has a `workspaces` field. No runtime deps (only `node:fs`/`node:path`).
- Consumers must add `"@repo/env": "workspace:*"` to their `package.json` and `import "@repo/env/load"` at the top of any module reading env (db client, auth, drizzle config, CLI entrypoints). Currently wired in: `packages/db/index.ts`, `packages/db/drizzle.config.ts`, `apps/web/src/lib/auth.ts`, `packages/auth/src/env.ts`.
- If a consumer can't find its env, the root `.env`/`.env.local` is missing — create them at the repo root (gitignored).

## Database (`packages/db`)

- Postgres 17 in Docker: `docker compose up -d` → container `pe-intelligence-db`, db `crm`, user/pass `postgres`/`postgres`, port 5432. URL: `postgres://postgres:postgres@localhost:5432/crm`.
- `index.ts` exports `db` (a `drizzle()` instance) and re-exports the schema. `db` is created with `{ relations }` — keep that.
- **All schema lives in a single file `packages/db/schema.ts`** (repo convention — do not split into multiple schema files). It holds the Better Auth tables (`users`, `sessions`, `accounts`, `verifications`), `rate_limits` (rateLimit storage `"database"`), and the onboarding tables (`firms`, `investment_mandates`, `mandate_sectors`, `mandate_criteria`), all with `relations`.
- Drizzle is on the **v1 line (`1.0.0-rc.4`)**:
  - Relations use the new API: `defineRelations(...)` — the old `relations()` function does **not** exist in this version and will throw `relations is not a function` from drizzle-kit. Use `helpers.many.X({ from: [helpers.a.col], to: [helpers.b.col] })` / `helpers.one.X(...)` form, not `{ fields, references }`.
  - Uses the **v3 migration folder structure**: one folder per migration under `packages/db/drizzle/<timestamp>_<name>/` containing `migration.sql` + `snapshot.json`, with **no `meta/_journal.json`**. Don't expect the old layout.
- Migrations: `cd packages/db && bun run db:generate`, then `bun run db:migrate`, then `db:studio`. `drizzle.config.ts` imports `@repo/env/load` and reads `process.env.DATABASE_URL!` — with a root `.env` present it works from any cwd; otherwise pass it inline: `DATABASE_URL=postgres://postgres:postgres@localhost:5432/crm bun run db:migrate`.
- `packages/db/tsconfig.json` excludes `drizzle/` — the CLI writes `packages/db/drizzle/auth-schema.generated.ts` there (gitignored) as a regenerable artifact of `auth:generate`.
- If you change Better Auth plugins/providers, regenerate via `cd packages/auth && DATABASE_URL=... bun run auth:generate` (writes `../db/drizzle/auth-schema.generated.ts`), then reconcile the table changes into `schema.ts` using the v1 `defineRelations` API. The CLI emits old-style `relations()` code and `bigint`/`uniqueIndex` differences; never copy its relations block verbatim. Then `cd packages/db && bun run db:generate && bun run db:migrate`.

## Auth (`packages/auth`, `@repo/auth`)

- **All Better Auth config lives in `packages/auth`** — apps compose `authOptions` from `@repo/auth` and add their framework plugin (hosts only, never in the package).
- Server config: `packages/auth/src/auth.ts` — `auth = betterAuth(authOptions)` with `drizzleAdapter(db, { provider: 'pg', schema, usePlural: true })`, `emailAndPassword.enabled: false`, Google social provider (only if `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` both set), account linking, 7-day sessions with `updateAge` + cookie cache, DB-backed rate limiting, `trustedOrigins`. **Single-tenant, no org/SSO plugins — anyone with a Google account can sign up.** Exports `auth`, `authOptions`, `type Auth`, `type Session`, `type SessionUser`. **No framework imports.**
- Hooks in `authOptions.databaseHooks`: `session.create.after` fires `notifySignedIn`.
- Server config host: `apps/web/src/lib/auth.ts` composes `authOptions` from `@repo/auth` + `tanstackStartCookies()` plugin.
- Client: `apps/web/src/lib/auth-client.ts` re-exports `authClient` (and `getSession`/`signIn`/`signOut`/`useSession`) from `@repo/auth/client`.
- Route handler: `apps/web/src/routes/api/auth/$.ts` forwards GET/POST to `auth.handler(request)`.
- Helper modules (subpath exports of `@repo/auth`): `env` (frozen, from root env), `scopes` (Google OAuth scopes), `signed-in` (pub/sub), `cookies` (`cookiePrefix`).
- Onboarding: `apps/web/src/routes/onboarding.tsx` is a 4-step wizard (firm basics → strategy → sectors → preferences) guarded by `beforeLoad` (redirects unauthenticated → `/`, already-onboarded → `/dashboard`). Submits via `saveOnboarding` in `apps/web/src/lib/onboarding.ts` (a `createServerFn` that persists firm + mandate + sectors + criteria in one `db.transaction`). `apps/web/src/routes/dashboard.tsx` shows the resulting mandate.
- Env (in **root `.env`/`.env.local`**, gitignored): `BETTER_AUTH_URL=http://localhost:3000`, `BETTER_AUTH_SECRET` (generate via `bunx --bun @better-auth/cli secret`), `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, optional `APP_URL`, `COOKIE_DOMAIN`, `NODE_ENV`. Google callback redirect URI: `http://localhost:3000/api/auth/callback/google`.
- Vite still loads `apps/web/.env*` for client-side `import.meta.env` (`VITE_*`) vars — those stay in `apps/web`, everything else lives at the root.
- Sanity check: `curl http://localhost:3000/api/auth/ok` → `{"ok":true}`.

## Conventions

- Imports in web use the `#/*` alias (`#/lib/auth`, `#/components/ui/button`) mapping to `./src/*`.
- Env files are gitignored; never commit `.env*`.
