import { Badge } from "@/components/ui/badge";
import { Tag } from "@/types/trade";

interface TagBadgeProps {
  tag: Tag;
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <Badge
      variant="outline"
      style={{
        backgroundColor: tag.color ? `${tag.color}10` : undefined,
        color: tag.color ?? undefined,
        borderColor: tag.color ? `${tag.color}40` : undefined,
      }}
    >
      {tag.name}
    </Badge>
  );
}
