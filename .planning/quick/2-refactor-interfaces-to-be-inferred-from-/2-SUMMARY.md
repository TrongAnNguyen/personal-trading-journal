# Quick Task Summary: refactor-interfaces-to-be-inferred-from-schemas

## Changes Implemented
- **Added `userSchema`**: Defined `userSchema` in `src/types/trade/schemas.ts` to match the previously existing `User` interface.
- **Refactored `src/types/trade/interfaces.ts`**: Replaced manual interface definitions with `z.infer` from the corresponding Zod schemas. This ensures that the TypeScript types always stay in sync with the validation schemas.
- **Exported types**:
    - `Trade`
    - `Tag`
    - `Attachment`
    - `ChecklistItem`
    - `Account`
    - `User`

## Impact
- **Single Source of Truth**: The schemas now define both runtime validation and TypeScript types.
- **Type Safety**: Any changes to the schemas will automatically propagate to the types used throughout the application.
- **Reduced Boilerplate**: Eliminated redundant type definitions.
