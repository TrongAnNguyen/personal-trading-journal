"use client";

import { cn } from "@/lib/utils";
import React, { memo } from "react";

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
}

export const ToolbarButton = memo(
  ({ onClick, isActive = false, children, title }: ToolbarButtonProps) => {
    console.log(`${title}-${isActive}`);

    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "hover:bg-muted text-muted-foreground hover:text-foreground",
        )}
      >
        {children}
      </button>
    );
  },
);

ToolbarButton.displayName = "ToolbarButton";
