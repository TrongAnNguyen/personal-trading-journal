# Codebase Conventions

**Analysis Date: 2026-02-27**

## Naming Patterns

- **Files:** kebab-case (e.g., `src/components/trades/trade-form.tsx`)
- **Components:** PascalCase (e.g., `TradeForm`)
- **Functions/Variables:** camelCase (e.g., `createTrade`, `isPending`)
- **Types/Interfaces:** PascalCase (e.g., `CreateTradeInput`)

## Code Style

- **Formatting:** Prettier configured with `printWidth: 80`, `semi: true`, `singleQuote: false`, and `trailingComma: "all"`.
- **Linting:** ESLint using `next/core-web-vitals`, `next/typescript`, and `prettier`.
- **Import Organization:** Uses path aliases (e.g., `@/lib/db`).
- **Error Handling:** `try-catch` blocks in Server Actions and Client Components; errors are typically logged to the console.
- **Module Design:** Strict use of "use server" for actions and "use client" for interactive components.

---
*Conventions audit: 2026-02-27*