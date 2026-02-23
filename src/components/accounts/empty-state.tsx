import { Wallet } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-muted-foreground col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
      <Wallet className="mb-4 h-12 w-12 opacity-20" />
      <p className="text-foreground font-medium">No accounts created yet.</p>
      <p className="text-sm">
        Add your first trading account to start logging trades.
      </p>
    </div>
  );
}
