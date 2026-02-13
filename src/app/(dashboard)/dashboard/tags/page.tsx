import { getTags } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tags } from "lucide-react";
import { CreateTagDialog } from "./create-tag-dialog";
import type { Tag } from "@/types/trade";

export default async function TagsPage() {
  const tags = await getTags();

  // Group tags by type
  const tagsByType = tags.reduce((acc: Record<string, Tag[]>, tag) => {
    const type = tag.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(tag);
    return acc;
  }, {});

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

      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(tagsByType).map(([type, typeTags]) => (
          <Card key={type}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg capitalize">
                <Tags className="h-5 w-5 opacity-50" />
                {type.toLowerCase().replace("_", " ")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {typeTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    style={{
                      backgroundColor: tag.color ? `${tag.color}10` : undefined,
                      color: tag.color ?? undefined,
                      borderColor: tag.color ? `${tag.color}40` : undefined,
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {tags.length === 0 && (
          <div className="text-muted-foreground col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
            <Tags className="mb-4 h-12 w-12 opacity-20" />
            <p>No tags created yet.</p>
            <p className="text-sm">
              Create your first tag to categorize your trades.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
