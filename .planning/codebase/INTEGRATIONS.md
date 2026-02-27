# External Integrations

**Analysis Date:** 2025-02-27

## APIs & External Services

**Supabase:**
- Auth - User management and authentication (in `src/lib/supabase/`)
  - SDK/Client: `@supabase/ssr` ^0.8.0, `@supabase/supabase-js` ^2.95.3
  - Auth: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- Database - Managed PostgreSQL (connected via Prisma)
- Storage - Image attachments for trades (bucket: `knowledge-base-media` in `src/app/api/upload/route.ts`)

**Cloudflare:**
- KV Storage - Key-value caching layer accessed via a custom worker (`kv-worker.js`)
  - SDK/Client: Fetch API in `src/lib/redis.ts`
  - URL: `CLOUDFLARE_KV_WORKER_URL`

## Data Storage

**Databases:**
- PostgreSQL (Supabase)
  - Connection: `DATABASE_URL`, `DIRECT_URL`
  - Client: Prisma ORM (`@prisma/client` ^6.0.0)

**File Storage:**
- Supabase Storage (bucket: `knowledge-base-media`)
  - Implementation: `src/app/api/upload/route.ts`

**Caching:**
- Cloudflare KV
  - Implementation: `src/lib/redis.ts` acting as a Redis-like interface

## Authentication & Identity

**Auth Provider:**
- Supabase Auth
  - Implementation: Standard Next.js server-side and client-side clients in `src/lib/supabase/`

## Monitoring & Observability

**Error Tracking:**
- None detected (standard `console.error` usage in `src/lib/db.ts` and `src/lib/redis.ts`)

**Logs:**
- Standard console logs, with Prisma query logging enabled in development mode in `src/lib/db.ts`

## CI/CD & Deployment

**Hosting:**
- Vercel (indicated by `.vercel` directory)

**CI Pipeline:**
- None detected (no `.github/workflows/` or similar configuration files found)

## Environment Configuration

**Required env vars:**
- `DATABASE_URL` - Prisma connection string
- `DIRECT_URL` - Prisma direct connection string for migrations
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` - Supabase public anon key
- `CLOUDFLARE_KV_WORKER_URL` - URL to the deployed KV Worker for caching

**Secrets location:**
- Stored in `.env` (development) and Vercel/Supabase dashboard (production)

## Webhooks & Callbacks

**Incoming:**
- `/app/auth/callback/route.ts` - Supabase auth callback endpoint

**Outgoing:**
- None detected

---

*Integration audit: 2025-02-27*
