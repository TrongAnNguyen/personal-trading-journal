This file provides guidance to AI Agent when working with code in this repository.

## Commands

- `rtk npm run dev` — Start Next.js dev server
- `rtk npm run build` — Production build
- `rtk npm run lint` — ESLint
- `rtk npm run format` — Prettier (entire project)
- `rtk npm test` — Run all Vitest tests
- `rtk npm run test:coverage` — Run tests with coverage
- `rtk npx vitest run src/lib/actions/trades.test.ts` — Run a single test file
- `rtk npx vitest run -t "createTrade"` — Run tests matching a pattern
- `rtk npx prisma generate` — Regenerate Prisma client after schema changes
- `rtk npx prisma migrate dev` — Apply pending migrations (Do not run, ask user to run this)

## Architecture

**Stack:** Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TypeScript + PostgreSQL (Prisma) + Supabase Auth + Cloudflare KV (caching).

### Directory Layout

```
prisma/              # Schema + migrations
src/
  app/               # Next.js App Router pages & layouts
    (auth)/          # Login/register routes
    (dashboard)/     # Main app shell with sidebar navigation
    api/             # API routes (e.g., file upload)
    auth/            # Auth callback & server actions
  components/        # React components by feature
    ui/              # shadcn/ui primitives (button, card, dialog, etc.)
    trades/          # Trade CRUD forms, lists, table
    accounts/        # Account management
    dashboard/       # Metrics, equity curve, live trades
    knowledge-base/  # Rich text editor (TipTap), graph view, sidebar
    tags/            # Tag CRUD
    settings/        # Discipline checklist, security, session settings
    tiptap-editor/   # Custom TipTap extensions, icons, UI primitives
  hooks/             # Custom React hooks
  lib/
    actions/         # Server Actions (trades, accounts, tags, knowledge-base, checklist)
    supabase/        # Supabase client (client, server, middleware)
    db.ts            # Prisma client singleton
    redis.ts         # Cloudflare KV wrapper (get/set/del/delPrefix)
    calculations.ts  # PnL, risk/reward, metrics, equity curve
  types/             # Zod schemas, enums, interfaces, metric types
  constants/         # Cache tags & TTLs
```

### Key Patterns

- **Server Actions** in `src/lib/actions/` — business logic runs on the server using `createAction()` wrapper (from `utils.ts`) that handles auth + Zod validation. Actions return `{ success, data } | { success, error }`.
- **Authentication:** Supabase Auth via `getAuthenticatedUserId()` in `utils.ts`. All data queries filter by `userId` (multi-tenant by design).
- **Caching:** Cloudflare KV worker (`kv-worker.js`) for caching trade lists by user. Cache invalidated on mutations via `redis.delPrefix()`.
- **State:** Minimal client state — server state via Next.js cache/revalidation, theme via `next-themes`.
- **Testing:** Vitest with mocked Prisma + Redis + `next/cache`. Mock approach: `vi.mock()` before imports, manual mock for `createAction()` that unwraps to pass userId directly.
- **Styling:** Tailwind CSS v4 with `tw-animate-css` for animations, custom SCSS variables, glass-morphism pattern, CSS radial gradient backgrounds.
- **Editor:** TipTap-based rich text editor with custom extensions (image upload, horizontal rule, node backgrounds) and mention suggestions linked to notes.
- **Database:** Decimal types for financial precision (Decimal(18,2) for money, Decimal(18,8) for crypto prices). Enums mapped via Prisma for asset class, trade side, status, emotion, tag types.
