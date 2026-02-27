# Quick Task Summary: fix-serialization-in-server-actions

## Changes Implemented
- **New Output Schemas**: Added `decimalSchema`, `tagSchema`, `checklistItemSchema`, `attachmentSchema`, `tradeSchema`, and `accountSchema` to `src/types/trade/schemas.ts`.
- **Type Alignment**: Updated `Account` and `Trade` interfaces to use `number` instead of `Decimal` for all numeric fields.
- **Action Wrapper**: Implemented `createAction` in `src/lib/actions/utils.ts` for type-safe server actions with standardized responses and automatic serialization.
- **Refactoring**: Updated `trades.ts`, `accounts.ts`, `tags.ts`, and `checklist.ts` to use schema-driven serialization.
- **UI Fix**: Updated `close-trade-form.tsx` to match the new `closeTrade` action signature.
- **Cleanup**: Deprecated the manual `serialize` utility in `src/lib/utils.ts`.

## Impact
- **Consistency**: Server and client now share the same strict Zod schemas for data exchange.
- **Maintenance**: Reduced boilerplate in server actions.
- **Reliability**: Automatic conversion of Prisma Decimals to native numbers avoids common serialization errors in Next.js Server Actions.
