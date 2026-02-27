# Technology Stack

**Analysis Date:** 2025-02-27

## Languages

**Primary:**
- TypeScript 5.x - Core codebase and server-side logic in `src/`

**Secondary:**
- JavaScript - Custom Cloudflare Worker in `kv-worker.js` and configuration files like `postcss.config.mjs`

## Runtime

**Environment:**
- Node.js - Server-side execution and build environment
- Cloudflare Workers - Serverless runtime for KV storage caching

**Package Manager:**
- pnpm 10.x - Lockfile: `pnpm-lock.yaml`

## Frameworks

**Core:**
- Next.js 16.1.6 - Full-stack React framework
- React 19.2.3 - UI library with React Compiler enabled in `next.config.ts`

**Testing:**
- Not detected - No testing framework or test files found in initial scan

**Build/Dev:**
- Tailwind CSS 4 - Styling framework with `@tailwindcss/postcss`
- PostCSS - CSS transformation tool in `postcss.config.mjs`
- ESLint 9.x - Linting tool in `.eslintrc.json`
- Prettier 3.x - Code formatter in `.prettierrc`
- Prisma 6.x - Database ORM and schema management in `prisma/schema.prisma`

## Key Dependencies

**Critical:**
- `@prisma/client` ^6.0.0 - Type-safe database access layer
- `@supabase/supabase-js` ^2.95.3 - Supabase SDK for auth and storage
- `@supabase/ssr` ^0.8.0 - Next.js auth utilities for Supabase
- `zod` ^3.x - Schema validation for forms and API requests
- `react-hook-form` ^7.71.1 - Form management

**Infrastructure:**
- `lucide-react` ^0.563.0 - Icon set
- `recharts` ^3.7.0 - Charting library for trade analytics
- `radix-ui` ^1.4.3 - Primitives for UI components (via shadcn)
- `@tiptap/react` ^3.20.0 - Rich text editor for trading notes

## Configuration

**Environment:**
- Configured via `.env` file and accessed via `process.env` in `src/lib/`
- Key configs: `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`, `CLOUDFLARE_KV_WORKER_URL`

**Build:**
- `next.config.ts` - Next.js configuration (React Compiler: enabled)
- `tsconfig.json` - TypeScript compiler settings
- `prisma.config.ts` - Prisma ORM configuration

## Platform Requirements

**Development:**
- Node.js and pnpm installed
- PostgreSQL database accessible (e.g., via Supabase)
- Cloudflare KV Worker deployed (for caching features)

**Production:**
- Vercel - Primary hosting platform for Next.js application
- Supabase - Database and Auth provider
- Cloudflare Workers - KV storage caching layer

---

*Stack analysis: 2025-02-27*
