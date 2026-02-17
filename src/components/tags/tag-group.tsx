import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tags } from "lucide-react";
import { TagBadge } from "./tag-badge";
import { Tag } from "@/types/trade";

interface TagGroupProps {
  type: string;
  tags: Tag[];
}

export function TagGroup({ type, tags }: TagGroupProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg capitalize">
          <Tags className="h-5 w-5 opacity-50" />
          {type.toLowerCase().replace("_", " ")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
