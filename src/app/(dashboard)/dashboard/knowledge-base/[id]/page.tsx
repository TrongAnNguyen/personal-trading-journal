import { getNote } from "@/lib/actions/knowledge-base";
import NoteEditor from "@/components/knowledge-base/editor-page";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const note = await getNote(id);
    return {
      title: `${note.title} | Knowledge Base`,
    };
  } catch {
    return {
      title: "Note Not Found",
    };
  }
}

async function NoteContent({ id }: { id: string }) {
  try {
    const note = await getNote(id);
    return <NoteEditor note={note} />;
  } catch (error) {
    console.error("[NOTE_PAGE_ERROR]", error);
    notFound();
  }
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground flex flex-1 animate-pulse items-center justify-center">
          Loading Note...
        </div>
      }
    >
      <NoteContent id={id} />
    </Suspense>
  );
}
