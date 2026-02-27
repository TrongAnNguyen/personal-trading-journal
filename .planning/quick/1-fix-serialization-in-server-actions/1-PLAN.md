# Quick Task: fix-serialization-in-server-actions

## Description
Replace manual `serialize()` utility with robust Zod schema transformations to handle Prisma Decimals and ensure type consistency.

## Implementation Tasks
- [x] Add output schemas with `DecimalToNumber` transform in `src/types/trade/schemas.ts`.
- [x] Update `Trade` and `Account` interfaces in `src/types/trade/interfaces.ts`.
- [x] Implement `createAction` wrapper in `src/lib/actions/utils.ts`.
- [x] Refactor `trades.ts`, `accounts.ts`, `tags.ts`, and `checklist.ts`.
- [x] Update call site in `close-trade-form.tsx`.
- [x] Deprecate `serialize` in `utils.ts`.

## Verification
- [ ] Run `npm run lint` (if available).
- [ ] Verify Decimal-to-number conversion on client.
