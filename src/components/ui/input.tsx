import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-border/50 bg-background/80 placeholder:text-muted-foreground/70 flex h-11 w-full rounded-xl border px-4 py-2 text-sm shadow-sm transition-all duration-200 outline-none",
        "hover:border-primary/30 hover:bg-background/95",
        "focus-visible:border-primary focus-visible:ring-primary/10 focus-visible:ring-4",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
