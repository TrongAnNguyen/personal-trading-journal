"use client";

import * as React from "react";
import {
  Plus,
  X,
  GripVertical,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateDisciplineChecklist } from "@/lib/actions/checklist";

interface DisciplineSettingsFormProps {
  initialItems: string[];
}

export function DisciplineSettingsForm({
  initialItems,
}: DisciplineSettingsFormProps) {
  const [items, setItems] = React.useState<string[]>(initialItems);
  const [newItemText, setNewItemText] = React.useState("");
  const [isPending, startTransition] = React.useTransition();
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    setItems([...items, newItemText.trim()]);
    setNewItemText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem();
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const onSave = () => {
    setMessage(null);
    startTransition(async () => {
      try {
        await updateDisciplineChecklist(items);
        setMessage({ type: "success", text: "Discipline checklist updated" });
      } catch (error) {
        setMessage({ type: "error", text: "Failed to update checklist" });
      }
    });
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`flex items-center gap-3 rounded-md p-4 ${
            message.type === "success"
              ? "bg-primary/10 text-primary border-primary/20 border"
              : "bg-destructive/10 text-destructive border-destructive/20 border"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new discipline rule (e.g., 'Stop loss is set')..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddItem}
            disabled={!newItemText.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="text-muted-foreground rounded-md border border-dashed py-8 text-center text-sm">
              No rules defined. Add your first discipline rule above.
            </p>
          ) : (
            items.map((item, index) => (
              <div
                key={index}
                className="bg-card/50 hover:bg-card group flex items-center gap-3 rounded-md border p-3 transition-colors"
              >
                <GripVertical className="text-muted-foreground/50 h-4 w-4" />
                <span className="flex-1 text-sm">{item}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleRemoveItem(index)}
                >
                  <X className="text-muted-foreground hover:text-destructive h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <Button onClick={onSave} disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Checklist"
        )}
      </Button>
    </div>
  );
}
