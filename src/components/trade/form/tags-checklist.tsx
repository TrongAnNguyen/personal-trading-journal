"use client";

import { useFormContext } from "react-hook-form";
import { ListChecks, Tags } from "lucide-react";
import { ChecklistManager } from "@/components/trade/checklist-manager";
import { TagSelector } from "@/components/trade/tag-selector";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export function TagsAndChecklist() {
  const { control } = useFormContext();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tags className="h-5 w-5" />
            Tags
          </CardTitle>
          <CardDescription>
            Categorize your trade (Strategy, Setup, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TagSelector
                    selectedTagIds={field.value || []}
                    onTagsChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ListChecks className="h-5 w-5" />
            Dicipline Checklist
          </CardTitle>
          <CardDescription>
            Confirm your trading plan before entry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="checklist"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ChecklistManager
                    items={field.value || []}
                    onItemsChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
