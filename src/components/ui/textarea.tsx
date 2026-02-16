import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-xl border border-border/50 bg-background/80 px-4 py-3 text-sm shadow-sm transition-all duration-200 placeholder:text-muted-foreground/70 outline-none",
        "hover:border-primary/30 hover:bg-background/95",
        "focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
