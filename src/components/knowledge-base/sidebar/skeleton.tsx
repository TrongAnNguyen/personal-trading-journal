"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SidebarSkeleton() {
  return (
    <aside className="bg-muted/10 flex h-full w-64 shrink-0 flex-col border-r md:w-80">
      <div className="flex flex-col gap-4 border-b p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1 rounded-xl" />
          <Skeleton className="h-8 flex-1 rounded-xl" />
        </div>

        {/* Search */}
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>

      {/* Note List */}
      <ScrollArea className="flex-1 p-2">
        <div className="flex flex-col gap-1 px-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-2xl p-3 border border-transparent">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-4 rounded-md" />
              </div>
              <Skeleton className="h-3 w-1/3 rounded-md" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
