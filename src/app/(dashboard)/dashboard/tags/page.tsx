import { Suspense } from "react";
import { CreateTagDialog } from "@/components/tags/create-tag-dialog";
import { TagList } from "@/components/tags/tag-list";
import { TagListSkeleton } from "@/components/tags/tag-list-skeleton";

export default function TagsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground">
            Manage your trading tags and categories
          </p>
        </div>
        <CreateTagDialog />
      </div>

      <Suspense fallback={<TagListSkeleton />}>
        <TagList />
      </Suspense>
    </div>
  );
}
