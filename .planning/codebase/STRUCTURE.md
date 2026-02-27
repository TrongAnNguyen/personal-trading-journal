# Codebase Structure

**Analysis Date:** 2025-02-14

## Directory Layout

```
[project-root]/
├── prisma/             # [Prisma schema and migrations]
├── public/             # [Static assets: images, icons]
└── src/                # [Source code]
    ├── app/            # [Next.js App Router: routes and layouts]
    │   ├── (auth)/     # [Route group for authentication]
    │   ├── (dashboard)/# [Route group for the main application]
    │   └── api/        # [API routes for external/client-side calls]
    ├── components/     # [React components, organized by feature]
    │   ├── ui/         # [Shared UI primitives (shadcn/ui)]
    │   └── [feature]/  # [Feature-specific components (e.g., trades/)]
    ├── constants/      # [Global constants and configurations]
    ├── hooks/          # [Custom React hooks]
    ├── lib/            # [Business logic, utilities, and server actions]
    │   ├── actions/    # [Next.js Server Actions]
    │   ├── supabase/   # [Supabase client and server-side utilities]
    │   └── [utils].ts  # [Logic: calculations, db init, redis client]
    └── types/          # [TypeScript interfaces and types]
```

## Directory Purposes

**src/app:**
- Purpose: Defines the application's URL structure and top-level layouts.
- Contains: Page components, layout components, and error/loading states.
- Key files: `src/app/layout.tsx`, `src/app/(dashboard)/dashboard/layout.tsx`.

**src/components:**
- Purpose: Reusable UI blocks and feature-specific components.
- Contains: Feature folders (e.g., `trades`, `accounts`, `knowledge-base`).
- Key files: `src/components/ui/*.tsx` for primitive building blocks.

**src/lib/actions:**
- Purpose: Centralized business logic that runs on the server.
- Contains: Logic for database operations, caching, and state updates.
- Key files: `src/lib/actions/trades.ts`, `src/lib/actions/accounts.ts`.

**src/lib:**
- Purpose: Utility functions and third-party client initializations.
- Contains: `db.ts` (Prisma), `redis.ts` (Redis), `calculations.ts` (Trading math).
- Key files: `src/lib/db.ts`.

## Key File Locations

**Entry Points:**
- `src/app/page.tsx`: Initial entry (landing/redirect).
- `src/app/layout.tsx`: Root application shell.
- `src/app/(dashboard)/dashboard/layout.tsx`: Main application interface.

**Configuration:**
- `next.config.ts`: Next.js configuration.
- `prisma/schema.prisma`: Database schema.
- `tailwind.config.ts`: Styling configuration.
- `components.json`: shadcn/ui configuration.

**Core Logic:**
- `src/lib/actions/`: Domain logic and data mutation.
- `src/lib/calculations.ts`: Trading-specific logic (PnL, risk/reward).

**Testing:**
- Not detected (no dedicated `tests/` directory or `*.test.ts` files found in initial exploration).

## Naming Conventions

**Files:**
- Components/Pages: kebab-case (e.g., `trade-form.tsx`, `page.tsx`).
- Utilities/Actions: kebab-case (e.g., `db.ts`, `trades.ts`).

**Directories:**
- Feature folders: kebab-case (e.g., `knowledge-base`, `ui`).
- Route groups: (parentheses) (e.g., `(dashboard)`).

## Where to Add New Code

**New Feature:**
- Primary logic: `src/lib/actions/[feature].ts`.
- Components: `src/components/[feature]/`.
- Types: `src/types/[feature].ts`.

**New Component/Module:**
- Shared UI: `src/components/ui/`.
- Feature-specific UI: `src/components/[feature]/`.

**Utilities:**
- General helpers: `src/lib/utils.ts`.
- Domain logic: `src/lib/[domain].ts`.

## Special Directories

**prisma/:**
- Purpose: Database schema, migrations, and seed scripts.
- Generated: `node_modules/.prisma/client` (Yes).
- Committed: Yes (schema and migrations).

---

*Structure analysis: 2025-02-14*
