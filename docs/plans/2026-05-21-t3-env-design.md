# Design: Setup t3-oss/env

Date: 2026-05-21
Goal: Set up `@t3-oss/env-nextjs` to validate and provide type-safe access to environment variables.

## Active Environment Variables
The following environment variables are active in this project:
- `DATABASE_URL` (Server) - Postgres connection URL
- `DIRECT_URL` (Server) - Postgres direct connection URL
- `CLOUDFLARE_KV_WORKER_URL` (Server) - Cache KV worker URL
- `BETTER_AUTH_SECRET` (Server) - Secret key for Better-Auth
- `BETTER_AUTH_URL` (Server) - Base URL for Better-Auth
- `NODE_ENV` (Server) - Environment mode (development/test/production)

There are no active client-side (`NEXT_PUBLIC_`) environment variables.

## Architecture

We will implement a single schema file `src/env.ts` to manage these environment variables.

### 1. `src/env.ts`
Define a schema using `@t3-oss/env-nextjs` and `zod`.

### 2. `next.config.ts`
Import `src/env.ts` to validate the schema during build time.

### 3. Usage
Refactor existing files using `process.env` to import and use the validated `env` object from `src/env.ts`.
- `src/lib/db.ts`
- `src/lib/redis.ts`
