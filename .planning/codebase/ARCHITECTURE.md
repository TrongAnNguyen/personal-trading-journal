# Architecture

**Analysis Date:** 2025-02-14

## Pattern Overview

**Overall:** Modern Next.js App Router Architecture

**Key Characteristics:**
- Server-First: Leverages Next.js Server Components and Server Actions.
- Feature-Oriented: Components and logic are grouped by feature (e.g., `trades`, `accounts`, `knowledge-base`).
- Type-Safe: Strong TypeScript usage throughout, with Prisma for type-safe database access.

## Layers

**UI Layer:**
- Purpose: Handles user interaction and rendering.
- Location: `src/components/`
- Contains: React components, shadcn/ui primitives.
- Depends on: `src/hooks`, `lucide-react`, `next-themes`.
- Used by: `src/app/`

**Routing/Page Layer:**
- Purpose: Defines application routes and page-level layouts.
- Location: `src/app/`
- Contains: Route Groups `(auth)`, `(dashboard)`, and API routes.
- Depends on: `src/components/`, `src/lib/actions/`.
- Used by: Next.js Runtime.

**Logic/Action Layer:**
- Purpose: Handles business logic and data modification via Server Actions.
- Location: `src/lib/actions/`
- Contains: Domain-specific functions (e.g., `trades.ts`, `accounts.ts`).
- Depends on: `src/lib/db.ts`, `src/lib/redis.ts`, `src/lib/supabase/`.
- Used by: `src/components/`, `src/app/`.

**Data Access Layer:**
- Purpose: Manages interactions with the database and cache.
- Location: `prisma/`, `src/lib/db.ts`, `src/lib/redis.ts`.
- Contains: Prisma schema, database client initialization.
- Depends on: `@prisma/client`, `redis`.
- Used by: `src/lib/actions/`.

## Data Flow

**Trade Management Flow:**

1. User submits a form in `src/components/trades/trade-form.tsx`.
2. Component invokes a Server Action in `src/lib/actions/trades.ts`.
3. Server Action validates the session using `src/lib/actions/utils.ts`.
4. Server Action interacts with the PostgreSQL database via `src/lib/db.ts` (Prisma).
5. Server Action potentially invalidates or updates the Redis cache in `src/lib/redis.ts`.
6. Server Action calls `revalidatePath("/dashboard/trades")` to refresh the UI.

**State Management:**
- Server State: Managed by Next.js caching and revalidation.
- Client State: Minimal use of `useState` for UI-only state (e.g., modals, form field values).
- Global State: Theme state via `next-themes`.

## Key Abstractions

**Server Actions:**
- Purpose: Centralized, type-safe business logic that runs on the server.
- Examples: `src/lib/actions/trades.ts`, `src/lib/actions/accounts.ts`.
- Pattern: Exported `async` functions with `"use server"`.

**Database Models:**
- Purpose: Defines the core entities of the trading journal.
- Examples: `prisma/schema.prisma`.
- Pattern: Relational model using Prisma.

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Application load.
- Responsibilities: Setting up fonts, global styles, and `ThemeProvider`.

**Dashboard Layout:**
- Location: `src/app/(dashboard)/dashboard/layout.tsx`
- Triggers: Navigation to any `/dashboard/*` route.
- Responsibilities: Rendering the sidebar, navigation, and core application shell.

## Error Handling

**Strategy:** Pragmatic server-side error handling with client-side feedback.

**Patterns:**
- Try-catch blocks in Server Actions.
- Throwing specialized errors that are caught by UI or Next.js error boundaries.
- Toast notifications for user feedback (likely via shadcn/ui, though not explicitly seen in components list, common in this stack).

## Cross-Cutting Concerns

**Logging:** Configured in `src/lib/db.ts` for Prisma queries in development.
**Validation:** Zod is present in `node_modules`, likely used for form and action validation.
**Authentication:** Handled via Supabase Auth, with server-side session checks in `src/lib/actions/utils.ts`.

---

*Architecture analysis: 2025-02-14*
