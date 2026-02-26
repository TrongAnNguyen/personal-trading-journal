"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateNote } from "@/lib/actions/knowledge-base";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useBeforeUnload } from "react-use";
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

  // Use refs to track current values for the cleanup function
  const currentTitleRef = useRef(title);
  const currentContentRef = useRef(content);
  const initialTitleRef = useRef(note.title);
  const initialContentRef = useRef(note.content);

  useEffect(() => {
    currentTitleRef.current = title;
  }, [title]);

  useEffect(() => {
    currentContentRef.current = content;
  }, [content]);

  const isDirty = title !== note.title || content !== note.content;

  const save = useCallback(
    async (newTitle: string, newContent: string) => {
      if (
        newTitle === initialTitleRef.current &&
        newContent === initialContentRef.current
      )
        return;

      setSaveStatus("saving");
      try {
        const res = await updateNote(note.id, {
          title: newTitle,
          content: newContent,
        });
        if (res.data) {
          initialTitleRef.current = newTitle;
          initialContentRef.current = newContent;
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        } else {
          setSaveStatus("idle");
        }
      } catch (error) {
        console.error("[SAVE_ERROR]", error);
        setSaveStatus("idle");
      }
    },
    [note.id],
  );

  const handleManualSave = () => {
    startTransition(async () => {
      await save(title, content);
    });
  };

  // Auto-save when closing tab/refreshing
  useBeforeUnload(isDirty, "You have unsaved changes. Save them now?");

  // Auto-save on component unmount (client-side navigation)
  useEffect(() => {
    return () => {
      const finalTitle = currentTitleRef.current;
      const finalContent = currentContentRef.current;
      const initialTitle = initialTitleRef.current;
      const initialContent = initialContentRef.current;

      if (finalTitle !== initialTitle || finalContent !== initialContent) {
        // Use a fire-and-forget updateNote call for unmount
        updateNote(note.id, {
          title: finalTitle,
          content: finalContent,
        });
      }
    };
  }, [note.id]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 overflow-y-auto px-8 py-10">
      <div className="flex items-center justify-between">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="focus-visible:border-primary h-auto flex-1 rounded-none border-none bg-transparent px-0 py-2 text-4xl font-black tracking-tight shadow-none placeholder:opacity-20 focus-visible:ring-0"
          placeholder="Untitled Strategy..."
        />
        <div className="flex items-center gap-4 px-4">
          <div className="flex items-center gap-2">
            {saveStatus === "saving" && (
              <div className="text-muted-foreground flex animate-pulse items-center gap-1.5 text-xs">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </div>
            )}
            {saveStatus === "saved" && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Saved
              </div>
            )}
          </div>
          <Button
            onClick={handleManualSave}
            disabled={!isDirty || isPending || saveStatus === "saving"}
            size="sm"
            className="gap-2"
          >
            {isPending || saveStatus === "saving" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
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
