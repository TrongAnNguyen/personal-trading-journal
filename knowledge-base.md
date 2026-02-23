# Knowledge Base (The Second Brain)

This feature introduces a Markdown-based knowledge base to the Personal Trading Journal. Traders can keep track of course notes, book summaries, market observations, and build strategies. It includes TipTap as the WYSIWYG editor, Supabase Storage for rich media (images, PDFs), bidirectional linking across the system, and a visual graph representation.

## User Review Required

- **Storage Limits**: Is it acceptable to set a default hard limit per user of 50MB for `knowledge-base-media` via application logic and Supabase Storage restrictions?

## Proposed Changes

### Tech Stack

- **Frontend**: TipTap (React), Tailwind CSS, Shadcn UI, `react-force-graph`
- **Backend**: Next.js Server Actions, Supabase Storage, Prisma
- **Project Type**: WEB

### File Structure

#### [NEW] `src/components/knowledge-base/editor.tsx`

#### [NEW] `src/components/knowledge-base/note-list.tsx`

#### [NEW] `src/components/knowledge-base/graph-view.tsx`

#### [NEW] `src/app/dashboard/knowledge-base/page.tsx`

#### [NEW] `src/app/api/upload/route.ts`

### Database Changes (`prisma/schema.prisma`)

#### [MODIFY] `prisma/schema.prisma`

Add models `Note`, `NoteLink`, `TradeNoteLink`. Update `User` and `Trade` models to relate to Notes.

### Task Breakdown

#### Task 1: Database Schema Expansion

- **Agent**: `database-architect` | **Skill**: `database-design`
- **INPUT**: `prisma/schema.prisma`
- **OUTPUT**: Add `Note`, `NoteLink`, and `TradeNoteLink` models. Create DB migration.
- **VERIFY**: Run `npx prisma format` and `npx prisma db push --preview-feature` (or migrate dev) to ensure schema is valid.

#### Task 2: Supabase Storage Configuration

- **Agent**: `backend-specialist` | **Skill**: `api-patterns`
- **INPUT**: Supabase Dashboard / SQL Migration
- **OUTPUT**: Create `knowledge-base-media` bucket. Define RLS policies for authenticated uploads/reads. Add storage limits.
- **VERIFY**: Successfully upload a test image via a test script or CURL.

#### Task 3: TipTap Editor Component Implementation

- **Agent**: `frontend-specialist` | **Skill**: `frontend-design`
- **INPUT**: `src/components/knowledge-base/editor.tsx`
- **OUTPUT**: A WYSIWYG TipTap editor supporting Markdown shortcuts, slash commands for templates, and drag-and-drop file upload integration.
- **VERIFY**: Editor renders correctly and outputs valid HTML/Markdown.

#### Task 4: Universal Bidirectional Linking

- **Agent**: `frontend-specialist` | **Skill**: `react-best-practices`
- **INPUT**: TipTap Editor extension
- **OUTPUT**: A TipTap extension that triggers on `[[` to search Notes and Trades, inserting a custom node link and updating DB relations on save.
- **VERIFY**: Typing `[[` shows a popover with results; selecting one inserts a link.

#### Task 5: Note Management UI and Strategy Templates

- **Agent**: `frontend-specialist` | **Skill**: `vercel-composition-patterns`
- **INPUT**: `src/app/dashboard/knowledge-base/page.tsx`
- **OUTPUT**: Sidebar with tree/list of notes, ability to create "Strategy" templates (pre-filled markdown).
- **VERIFY**: Can create, read, update, and delete notes. Strategy template pre-fills editor.

#### Task 6: Graph Visualization

- **Agent**: `frontend-specialist` | **Skill**: `frontend-design`
- **INPUT**: `src/components/knowledge-base/graph-view.tsx`
- **OUTPUT**: Implementation of `react-force-graph-2d` showing nodes (Notes, Trades) and links.
- **VERIFY**: Graph renders nodes and connects them accurately based on DB `NoteLink` and `TradeNoteLink` data.

## ✅ PHASE X COMPLETE

- Lint: [x]
- Security: [x]
- Build: [x]
- Date: [2024-02-23]
