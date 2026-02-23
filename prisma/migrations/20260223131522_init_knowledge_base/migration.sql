-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_links" (
    "id" TEXT NOT NULL,
    "sourceNoteId" TEXT NOT NULL,
    "targetNoteId" TEXT NOT NULL,

    CONSTRAINT "note_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trade_note_links" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,

    CONSTRAINT "trade_note_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notes_userId_idx" ON "notes"("userId");

-- CreateIndex
CREATE INDEX "note_links_sourceNoteId_idx" ON "note_links"("sourceNoteId");

-- CreateIndex
CREATE INDEX "note_links_targetNoteId_idx" ON "note_links"("targetNoteId");

-- CreateIndex
CREATE UNIQUE INDEX "note_links_sourceNoteId_targetNoteId_key" ON "note_links"("sourceNoteId", "targetNoteId");

-- CreateIndex
CREATE INDEX "trade_note_links_tradeId_idx" ON "trade_note_links"("tradeId");

-- CreateIndex
CREATE INDEX "trade_note_links_noteId_idx" ON "trade_note_links"("noteId");

-- CreateIndex
CREATE UNIQUE INDEX "trade_note_links_tradeId_noteId_key" ON "trade_note_links"("tradeId", "noteId");

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_links" ADD CONSTRAINT "note_links_sourceNoteId_fkey" FOREIGN KEY ("sourceNoteId") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_links" ADD CONSTRAINT "note_links_targetNoteId_fkey" FOREIGN KEY ("targetNoteId") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade_note_links" ADD CONSTRAINT "trade_note_links_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade_note_links" ADD CONSTRAINT "trade_note_links_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
