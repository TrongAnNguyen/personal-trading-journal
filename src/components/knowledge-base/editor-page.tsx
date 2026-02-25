"use client";

import { Input } from "@/components/ui/input";
import { updateNote } from "@/lib/actions/knowledge-base";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useCallback, useState, useTransition } from "react";
import { useDebounce } from "react-use";
import KnowledgeBaseEditor from "./editor";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function NoteEditor({ note }: { note: Note }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const save = useCallback(
    async (newTitle: string, newContent: string) => {
      if (newTitle === note.title && newContent === note.content) return;

      startTransition(async () => {
        const res = await updateNote(note.id, {
          title: newTitle,
          content: newContent,
        });
        if (res.data) {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        } else {
          setSaveStatus("idle");
        }
      });
    },
    [note.id, note.title, note.content],
  );

  useDebounce(
    () => {
      if (content !== note.content || title !== note.title) {
        save(title, content);
      }
    },
    500,
    [content, title, note.content, note.title, save],
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 overflow-y-auto px-8 py-10">
      <div className="flex items-center justify-between">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="focus-visible:border-primary h-auto flex-1 rounded-none border-none bg-transparent px-0 py-2 text-4xl font-black tracking-tight shadow-none placeholder:opacity-20 focus-visible:ring-0"
          placeholder="Untitled Strategy..."
        />
        <div className="flex items-center gap-2 px-4">
          {isPending && (
            <div className="text-muted-foreground flex animate-pulse items-center gap-1.5 text-xs">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </div>
          )}
          {!isPending && saveStatus === "saved" && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Saved
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <KnowledgeBaseEditor
          key={note.id}
          initialContent={content}
          onChange={setContent}
        />
      </div>
    </div>
  );
}
