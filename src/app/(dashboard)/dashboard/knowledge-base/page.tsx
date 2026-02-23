import KnowledgeBaseClient from "./client";

export const metadata = {
  title: "Knowledge Base | The Second Brain",
  description: "Smart note-taking and strategy builder",
};

export default function KnowledgeBasePage() {
  return (
    <div className="bg-background h-[calc(100vh-64px)] overflow-hidden">
      <KnowledgeBaseClient />
    </div>
  );
}
