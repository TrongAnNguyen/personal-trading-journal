import { getTags } from "@/lib/actions/tags";
import { TagGroup } from "./tag-group";
import { EmptyState } from "./empty-state";
import { Tag } from "@/types/trade";

export async function TagList() {
  const tags = await getTags();

  if (tags.length === 0) {
    return <EmptyState />;
  }

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
    <div className="grid gap-6 md:grid-cols-2">
      {Object.entries(tagsByType).map(([type, typeTags]) => (
        <TagGroup key={type} type={type} tags={typeTags} />
      ))}
    </div>
  );
}
