import { Tags } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-muted-foreground col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
      <Tags className="mb-4 h-12 w-12 opacity-20" />
      <p>No tags created yet.</p>
      <p className="text-sm">
        Create your first tag to categorize your trades.
      </p>
    </div>
  );
}
