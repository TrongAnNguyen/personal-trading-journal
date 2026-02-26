import { getNotes } from "@/lib/actions/knowledge-base";
import KnowledgeBaseSidebar from "./index";

export default async function KnowledgeBaseSidebarContainer() {
  const notes = await getNotes();

  return <KnowledgeBaseSidebar initialNotes={notes} />;
}
