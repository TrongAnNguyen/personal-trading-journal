---
phase: quick
plan: 2
type: execute
wave: 1
depends_on: []
files_modified: ["src/types/trade/schemas.ts", "src/types/trade/interfaces.ts"]
autonomous: true
requirements: ["REFACTOR-01"]
---

<objective>
Refactor TypeScript interfaces to be inferred from Zod schemas to ensure single source of truth for types.

Purpose: Reduce duplication and prevent sync issues between validation schemas and type definitions.
Output: Updated schemas.ts and interfaces.ts where interfaces are derived from Zod schemas.
</objective>

<execution_context>
@./.gemini/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@src/types/trade/schemas.ts
@src/types/trade/interfaces.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add userSchema and refactor interfaces</name>
  <files>
    - src/types/trade/schemas.ts
    - src/types/trade/interfaces.ts
  </files>
  <action>
    1. In `src/types/trade/schemas.ts`, add `userSchema` to match the `User` interface in `interfaces.ts`.
       ```typescript
       export const userSchema = z.object({
         id: z.string(),
         email: z.string(),
         name: z.string().nullable().optional(),
         settings: z.record(z.unknown()).nullable().optional(),
         createdAt: z.date(),
         updatedAt: z.date(),
       });
       ```
    2. In `src/types/trade/interfaces.ts`, import all relevant schemas from `./schemas`.
    3. Replace manual interface definitions with `z.infer` exports.
       - `export type Trade = z.infer<typeof tradeSchema>;`
       - `export type Tag = z.infer<typeof tagSchema>;`
       - `export type Attachment = z.infer<typeof attachmentSchema>;`
       - `export type ChecklistItem = z.infer<typeof checklistItemSchema>;`
       - `export type Account = z.infer<typeof accountSchema>;`
       - `export type User = z.infer<typeof userSchema>;`
    4. Ensure imports for enums are still correct or moved if needed (schemas.ts already imports them).
  </action>
  <verify>Check that src/types/trade/interfaces.ts contains z.infer calls and no longer contains manual interface definitions for these types.</verify>
  <done>Interfaces are now inferred from schemas, maintaining name compatibility.</done>
</task>

<task type="auto">
  <name>Task 2: Verify type consistency</name>
  <files></files>
  <action>
    Run a build or lint command to ensure that the change from interfaces to types (via z.infer) doesn't break any existing code that might depend on interface-specific behavior (like declaration merging, which is unlikely here).
  </action>
  <verify>
    npm run lint
  </verify>
  <done>Codebase passes linting/type-checking with inferred types.</done>
</task>

</tasks>

<success_criteria>
- src/types/trade/interfaces.ts is refactored to use z.infer.
- All 6 core types (Trade, Tag, Attachment, ChecklistItem, Account, User) are derived from schemas.
- The project still builds/lints successfully.
</success_criteria>

<output>
After completion, create .planning/phases/quick/2-refactor-interfaces-to-be-inferred-from-/2-SUMMARY.md
</output>
