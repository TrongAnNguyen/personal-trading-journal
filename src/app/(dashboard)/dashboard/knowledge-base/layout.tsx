import { Suspense } from "react";
import { getNotes } from "@/lib/actions/knowledge-base";
import KnowledgeBaseSidebar from "@/components/knowledge-base/sidebar";

export default async function KnowledgeBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notes = await getNotes();

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden rounded-3xl border bg-card/50 backdrop-blur-sm shadow-xl">
      <KnowledgeBaseSidebar initialNotes={notes} />
      <main className="relative flex h-full flex-1 flex-col overflow-hidden bg-background/50">
        <Suspense fallback={<div className="flex flex-1 items-center justify-center">Loading Content...</div>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
