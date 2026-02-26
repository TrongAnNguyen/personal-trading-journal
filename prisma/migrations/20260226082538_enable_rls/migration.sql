-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE INDEX "attachments_tradeId_idx" ON "attachments"("tradeId");

-- CreateIndex
CREATE INDEX "checklist_items_tradeId_idx" ON "checklist_items"("tradeId");

-- Helper for Prisma Shadow Database (ensure auth schema and roles exist)
-- We wrap this in a block that catches permission errors, as Supabase (production) 
-- will deny 'CREATE SCHEMA auth' but local/shadow databases will allow it.
DO $$
BEGIN
  -- 1. Try to create auth schema if it doesn't exist (fails silently on Supabase)
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
      CREATE SCHEMA auth;
    END IF;
  EXCEPTION WHEN insufficient_privilege THEN
    NULL; -- Ignore if we don't have permission (likely on real Supabase)
  END;

  -- 2. Define auth.uid() if it's missing or we can overwrite it
  -- On Supabase, this function already exists and we can't overwrite it.
  -- On Shadow DB, we need to create it.
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE n.nspname = 'auth' AND p.proname = 'uid'
  ) THEN
    BEGIN
      CREATE FUNCTION auth.uid() RETURNS uuid AS 'SELECT null::uuid;' LANGUAGE sql STABLE;
    EXCEPTION WHEN insufficient_privilege THEN
      NULL;
    END;
  END IF;

  -- 3. Create Supabase roles if missing
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role;
  END IF;
END
$$;

-- Enable Row Level Security (RLS) on all tables in the public schema
-- This protects against direct access via Supabase's REST/GraphQL APIs.
-- Prisma server-side calls (using the DATABASE_URL) will bypass RLS as they use the owner role.

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_note_links ENABLE ROW LEVEL SECURITY;

-- 1. public.users: Users can only manage their own profile
CREATE POLICY "Users can manage their own profile" ON public.users
  FOR ALL TO authenticated
  USING ( (SELECT auth.uid())::text = id )
  WITH CHECK ( (SELECT auth.uid())::text = id );

-- 2. public.accounts: Users can only manage their own accounts
CREATE POLICY "Users can manage their own accounts" ON public.accounts
  FOR ALL TO authenticated
  USING ( (SELECT auth.uid())::text = "userId" )
  WITH CHECK ( (SELECT auth.uid())::text = "userId" );

-- 3. public.trades: Users can only manage trades in their own accounts
CREATE POLICY "Users can manage their own trades" ON public.trades
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = "accountId" AND a."userId" = (SELECT auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = "accountId" AND a."userId" = (SELECT auth.uid())::text
    )
  );

-- 4. public.tags: Global Read-Only for authenticated users
CREATE POLICY "Authenticated users can view all tags" ON public.tags
  FOR SELECT TO authenticated
  USING ( true );

-- 5. public.trade_tags: Users can only manage tags for their own trades
CREATE POLICY "Users can manage their own trade_tags" ON public.trade_tags
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.trades t
      JOIN public.accounts a ON t."accountId" = a.id
      WHERE t.id = "tradeId" AND a."userId" = (SELECT auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trades t
      JOIN public.accounts a ON t."accountId" = a.id
      WHERE t.id = "tradeId" AND a."userId" = (SELECT auth.uid())::text
    )
  );

-- 6. public.attachments: Users can only manage attachments for their own trades
CREATE POLICY "Users can manage their own attachments" ON public.attachments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.trades t
      JOIN public.accounts a ON t."accountId" = a.id
      WHERE t.id = "tradeId" AND a."userId" = (SELECT auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trades t
      JOIN public.accounts a ON t."accountId" = a.id
      WHERE t.id = "tradeId" AND a."userId" = (SELECT auth.uid())::text
    )
  );

-- 7. public.checklist_items: Users can only manage checklist items for their own trades
CREATE POLICY "Users can manage their own checklist_items" ON public.checklist_items
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.trades t
      JOIN public.accounts a ON t."accountId" = a.id
      WHERE t.id = "tradeId" AND a."userId" = (SELECT auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trades t
      JOIN public.accounts a ON t."accountId" = a.id
      WHERE t.id = "tradeId" AND a."userId" = (SELECT auth.uid())::text
    )
  );

-- 8. public.checklist_templates: Users can only manage their own templates
CREATE POLICY "Users can manage their own templates" ON public.checklist_templates
  FOR ALL TO authenticated
  USING ( (SELECT auth.uid())::text = "userId" )
  WITH CHECK ( (SELECT auth.uid())::text = "userId" );

-- 9. public.notes: Users can only manage their own notes
CREATE POLICY "Users can manage their own notes" ON public.notes
  FOR ALL TO authenticated
  USING ( (SELECT auth.uid())::text = "userId" )
  WITH CHECK ( (SELECT auth.uid())::text = "userId" );

-- 10. public.note_links: Users can only manage links between their own notes
CREATE POLICY "Users can manage their own note_links" ON public.note_links
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.notes n
      WHERE n.id = "sourceNoteId" AND n."userId" = (SELECT auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.notes n
      WHERE n.id = "sourceNoteId" AND n."userId" = (SELECT auth.uid())::text
    )
  );

-- 11. public.trade_note_links: Users can only manage links for their own trades
CREATE POLICY "Users can manage their own trade_note_links" ON public.trade_note_links
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.trades t
      JOIN public.accounts a ON t."accountId" = a.id
      WHERE t.id = "tradeId" AND a."userId" = (SELECT auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trades t
      JOIN public.accounts a ON t."accountId" = a.id
      WHERE t.id = "tradeId" AND a."userId" = (SELECT auth.uid())::text
    )
  );
