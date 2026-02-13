"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { createTag, getTags } from "@/lib/actions/tags";
import { TagType, type Tag } from "@/types/trade";

interface TagSelectorProps {
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
}

export function TagSelector({
  selectedTagIds,
  onTagsChange,
}: TagSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  // Fetch tags on mount
  React.useEffect(() => {
    const fetchTags = async () => {
      const fetchedTags = await getTags();
      setTags(fetchedTags);
    };
    fetchTags();
  }, []);

  const handleSelect = (tagId: string) => {
    const newSelectedIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];
    onTagsChange(newSelectedIds);
  };

  const handleCreateTag = async () => {
    if (!inputValue.trim()) return;
    setIsCreating(true);
    try {
      // Default new tags to 'STRATEGY' type for now, could expand UI to select type
      const newTag = await createTag({
        name: inputValue.trim(),
        type: TagType.STRATEGY,
        color: "#6b7280", // Default gray
      });
      setTags((prev) => [...prev, newTag]);
      handleSelect(newTag.id);
      setInputValue("");
    } catch (error) {
      console.error("Failed to create tag:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {selectedTags.length > 0
              ? `${selectedTags.length} tag${
                  selectedTags.length > 1 ? "s" : ""
                } selected`
              : "Select tags..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search tags..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty className="px-4 py-2">
                <p className="text-muted-foreground text-sm">No tags found.</p>
                {inputValue && (
                  <Button
                    variant="ghost"
                    className="mt-2 h-auto w-full justify-start px-2 py-1 text-xs"
                    onClick={handleCreateTag}
                    disabled={isCreating}
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Create "{inputValue}"
                  </Button>
                )}
              </CommandEmpty>
              <CommandGroup heading="Available Tags">
                {tags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={() => handleSelect(tag.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTagIds.includes(tag.id)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: tag.color ?? "#6b7280" }}
                      />
                      <span>{tag.name}</span>
                      <span className="text-muted-foreground ml-auto text-xs">
                        {tag.type}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="flex items-center gap-1 py-1 pr-1 pl-2"
              style={{
                backgroundColor: tag.color ? `${tag.color}20` : undefined,
                color: tag.color ?? undefined,
                borderColor: tag.color ? `${tag.color}40` : undefined,
              }}
            >
              {tag.name}
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => handleSelect(tag.id)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {tag.name} tag</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
