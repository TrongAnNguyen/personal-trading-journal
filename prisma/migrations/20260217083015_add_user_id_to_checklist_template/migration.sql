/*
  Warnings:

  - Added the required column `userId` to the `checklist_templates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "checklist_templates" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "name" SET DEFAULT 'Discipline Checklist';

-- CreateIndex
CREATE INDEX "checklist_templates_userId_idx" ON "checklist_templates"("userId");

-- AddForeignKey
ALTER TABLE "checklist_templates" ADD CONSTRAINT "checklist_templates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
