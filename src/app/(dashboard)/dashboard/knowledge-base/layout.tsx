import { Suspense } from "react";
import KnowledgeBaseSidebarContainer from "@/components/knowledge-base/sidebar/container";
import { SidebarSkeleton } from "@/components/knowledge-base/sidebar/skeleton";

export default function KnowledgeBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card/50 flex h-[calc(100vh-64px)] w-full overflow-hidden rounded-3xl border shadow-xl backdrop-blur-sm">
      <Suspense fallback={<SidebarSkeleton />}>
        <KnowledgeBaseSidebarContainer />
      </Suspense>
      <main className="bg-background/50 relative flex h-full flex-1 flex-col overflow-hidden">
        <Suspense
          fallback={
            <div className="text-muted-foreground flex flex-1 animate-pulse items-center justify-center">
              Loading Content...
            </div>
          }
        >
          {children}
        </Suspense>
      </main>
    </div>
  );
}
