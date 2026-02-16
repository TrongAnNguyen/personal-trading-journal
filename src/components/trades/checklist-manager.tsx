"use client";

import * as React from "react";
import { Plus, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ChecklistItem {
  text: string;
  checked: boolean;
}

interface ChecklistManagerProps {
  items: ChecklistItem[];
  onItemsChange: (items: ChecklistItem[]) => void;
}

export function ChecklistManager({
  items,
  onItemsChange,
}: ChecklistManagerProps) {
  const [newItemText, setNewItemText] = React.useState("");

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    onItemsChange([...items, { text: newItemText.trim(), checked: false }]);
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
    onItemsChange(newItems);
  };

  const handleToggleItem = (index: number) => {
    const newItems = [...items];
    newItems[index].checked = !newItems[index].checked;
    onItemsChange(newItems);
  };

  return (
    <div className="space-y-4">
      {/* Add New Item */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a checklist item (e.g., 'Trend is aligned', 'R/R > 2')..."
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

      {/* List */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-muted-foreground rounded-md border border-dashed py-4 text-center text-sm">
            No checklist items. Add one above to build your trading plan.
          </p>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className="bg-card/50 hover:bg-card group flex items-center gap-3 rounded-md border p-2 transition-colors"
            >
              <GripVertical className="text-muted-foreground/50 h-4 w-4 cursor-grab" />
              <Checkbox
                checked={item.checked}
                onCheckedChange={() => handleToggleItem(index)}
                id={`checklist-item-${index}`}
              />
              <Label
                htmlFor={`checklist-item-${index}`}
                className={`flex-1 cursor-pointer ${
                  item.checked ? "text-muted-foreground line-through" : ""
                }`}
              >
                {item.text}
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => handleRemoveItem(index)}
              >
                <X className="text-muted-foreground hover:text-destructive h-3 w-3" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
