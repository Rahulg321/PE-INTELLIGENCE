# TanStack Start Refactor Prompt — Law Firm App

Copy the block below into your AI coding agent to refactor an EXISTING single-project TanStack Start app to adopt the feature-first architecture and directory structure from the PE-intelligence reference project. The prompt is framed as a refactor (preserve all functionality/data), not a scaffold.

---

```
You are refactoring an EXISTING TanStack Start application for a law firm to adopt a cleaner
architecture. Preserve ALL existing functionality, routes, URLs, and data — this is a structural
refactor, not a rewrite. Do it incrementally, feature by feature, running typecheck + lint after
each step so the app stays green throughout. Use Bun (`bun install`, `bun run`, `bunx tsc --noEmit`).

## Target architecture
Five layers; arrows point DOWN only, never back up:
```
routes/  (URL, guards, loaders — shells only)
  → features/<domain>/server/*.ts   (server fns: auth + zod validation, thin boundary)
  → features/<domain>/server/*-service.ts   (business logic + db — THE ONLY file importing db)
  → src/db  (schema, relations, client)
  → PostgreSQL
```

## Target directory structure (single project, NOT a monorepo)
```
src/
  router.tsx            # createTanStackRouter + QueryClientProvider Wrap
  styles.css            # Tailwind v4: @theme inline tokens + shadcn CSS vars
  lib/
    auth.ts             # betterAuth() host config (email/password + Google + DB adapter)
    utils.ts            # cn()
    db.ts               # drizzle client (created with { relations })
  components/
    ui/                 # shadcn primitives
    shared/             # cross-feature components (app-sidebar, brand-panel, split-layout)
  features/<domain>/
    components/         # feature UI (PascalCase exports)
    server/
      queries/          # createServerFn reads
      mutations/        # createServerFn writes
      <domain>-service.ts   # business ops + persistence (ONLY file importing db)
    schemas.ts, constants.ts, helpers.ts, client.ts
  hooks/
  db/
    schema/             # per-domain files: auth.ts, clients.ts, matters.ts, documents.ts, …
      relations.ts      # all defineRelations in one file
      index.ts          # re-exports
    client.ts, index.ts
  routes/
    __root.tsx
    index.tsx
    _auth.tsx  _auth/login.tsx  _auth/signup.tsx
    _dashboard.tsx  _dashboard/dashboard.tsx  _dashboard/matters.tsx  (one per domain page)
    _onboarding/onboarding.tsx
    api/auth/$.ts      # forwards GET/POST to auth.handler
```
Add `"imports": { "#/*": "./src/*" }` to package.json and convert imports to the `#/*` alias.

## Rules to enforce during the refactor
1. **Routes become shells.** Each route = `createFileRoute` + `beforeLoad`/`loader` +
   `component: <FeatureComponent>`. Move ALL db access, validation, and business logic OUT of
   routes into feature components/server fns/services. Loader data flows into components via the
   route wrapper.
2. **Server fns are thin.** `authMiddleware`/`getSessionUser()` (in
   `features/auth/server/`) + zod `.validator()` + delegate to a service.
   Components and routes must never import `db` or the auth host.
3. **Only `*-service.ts` imports `db`.** Audit every file that currently imports `db` and move
   that persistence into a service. Each feature gets `components/` + `server/{queries,mutations}`
   + a `-service.ts`.
4. **Consolidate schema** into `src/db/schema/` per-domain files, all `defineRelations` in
   `relations.ts`, re-exported from `index.ts`. Do NOT change the actual DB tables/columns.
5. **Shared code climbs:** used by 2+ features → `components/shared/` or `lib/`; single-feature
   helpers stay in the feature.
6. **Route groups** (`_auth`, `_dashboard`, `_onboarding`) only when a layout earns them (2nd
   page). A single-page flow (onboarding) keeps its shell in the route component.
7. **Naming:** kebab-case file names, PascalCase component exports (`onboarding-wizard.tsx` →
   `export function OnboardingWizard`).
8. **Never hand-edit `routeTree.gen.ts`** — run `bun run generate-routes` after moving routes.
9. **Drizzle v1:** use `defineRelations(...)` with `helpers.many.X({ from, to })` /
   `helpers.one.X(...)`. The old `relations()` function does not exist. Reuse existing migrations.
10. **Better Auth:** host config in `lib/auth.ts`; route handler `routes/api/auth/$.ts`;
    `emailAndPassword: { enabled: true }` + Google + DB-backed rate limiting + session cache.

## UX patterns worth porting if the app has auth/onboarding
- **Split two-column auth/onboarding layout:** left dark `brand-panel` (pure-CSS, hidden on
  mobile) + right `bg-parchment` content column. Auth pages are content-only under a shared
  `_auth.tsx` layout.
- **Server-side onboarding draft** so progress survives refreshes/return visits:
  `onboarding_drafts` table keyed by `user_id` (jsonb `data` + `step`); service methods
  getDraft/saveDraft/clearDraft; `_dashboard.beforeLoad` redirects not-onboarded users to
  `/onboarding`. Never gate onboarding on a user-unspecific "onboarded" cookie.
- Onboarding state = presence of the user's `firms` row (single source of truth; "completed at" is `firms.created_at`). No per-user onboarded flag.

## Suggested law-firm domain mapping (rename to what exists in this app)
`features/clients/`, `features/matters/`, `features/documents/`, `features/billing/`,
`features/auth/`, `features/dashboard/`.

## Plan of execution (do it in this order)
1. Inventory existing pages/features and map them to target domains. Present the mapping.
2. Set up the base skeleton: `lib/`, `db/schema/` reorganization, `#/*` alias, `components/ui`
   + `components/shared`.
3. Refactor ONE feature at a time (auth first, then dashboard, then each domain). After each:
   `bunx tsc --noEmit` and `bun run lint` must pass; run `bun run generate-routes`.
4. Move the auth host to `lib/auth.ts` and confirm `GET /api/auth/ok` returns `{"ok":true}`.
5. Final pass: grep for any remaining `db` imports outside `*-service.ts`, any business logic
   left in routes, and any relative `../../` imports. Fix them. Report before/after structure.
```
