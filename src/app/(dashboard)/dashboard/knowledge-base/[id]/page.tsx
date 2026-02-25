import { getNote } from "@/lib/actions/knowledge-base";
import NoteEditor from "@/components/knowledge-base/editor-page";
import { notFound } from "next/navigation";

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const note = await getNote(id);
    return <NoteEditor note={note} />;
  } catch (error) {
    console.error(error);
    return notFound();
  }
}
