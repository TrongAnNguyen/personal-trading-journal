# Codebase Concerns

**Analysis Date: 2026-02-27**

## Tech Debt

**Manual Serialization in Server Actions:**
- Issue: Use of a custom `serialize` utility to convert Prisma objects (with Dates/Decimals) to POJOs for Next.js.
- Files: `src/lib/actions/trades.ts`, `src/lib/actions/knowledge-base.ts`, `src/lib/utils.ts`
- Impact: Boilerplate code in every action; potential for mismatched types between server and client.
- Fix approach: Use a library like `superjson` or define strict Zod schemas for all Action returns to ensure consistency.

**Swallowed Cache Errors:**
- Issue: Redis errors are caught and logged but not bubbled up, potentially returning stale or inconsistent data if the cache fails silently.
- Files: `src/lib/actions/trades.ts` (in `getTrades` and `getTrade`)
- Impact: Hard-to-debug data inconsistencies when Redis is unstable.
- Fix approach: Implement a more robust error boundary or fallback strategy for the caching layer.

## Security Considerations

**Potential IDOR in Trades Action:**
- Issue: `getTrade` and `updateTrade` fetch/modify records by `id` without explicitly including `userId` in the Prisma `where` clause.
- Files: `src/lib/actions/trades.ts`
- Current mitigation: RLS (Row Level Security) appears to be enabled in migrations (`20260226082538_enable_rls`), but application-level checks are missing.
- Recommendations: Always include `userId` in Prisma queries: `prisma.trade.findUnique({ where: { id, userId } })`.

## Performance Bottlenecks

**God Action Files:**
- Problem: `trades.ts` and `knowledge-base.ts` are becoming large (300+ lines) and handle validation, database logic, caching, and revalidation.
- Files: `src/lib/actions/trades.ts`, `src/lib/actions/knowledge-base.ts`
- Cause: Lack of service layer abstraction.
- Improvement path: Extract database logic into service classes/functions and keep actions focused on request handling.

## Fragile Areas

**Calculation Edge Cases:**
- Files: `src/lib/calculations.ts`
- Why fragile: Many functions return `null` when data like `exitPrice` or `stopLoss` is missing. 
- Safe modification: Ensure all consuming UI components (charts, metrics cards) explicitly handle `null` values to avoid "NaN" or runtime crashes.
- Test coverage: Gaps in unit tests for these utility functions were noted.

## Test Coverage Gaps

**Server Actions and Utilities:**
- What's not tested: Complex PnL and Risk/Reward calculations; critical CRUD server actions.
- Files: `src/lib/calculations.ts`, `src/lib/actions/trades.ts`
- Risk: Calculation errors in financial software are high-impact.
- Priority: High

---
*Concerns audit: 2026-02-27*