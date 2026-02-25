"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  createNote,
  deleteNote,
  type NoteWithMeta,
} from "@/lib/actions/knowledge-base";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  BrainCircuit,
  Clock,
  Loader2,
  Network,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useOptimistic, useState, useTransition } from "react";
import GraphView from "../graph-view";

export default function KnowledgeBaseSidebar({
  initialNotes,
}: {
  initialNotes: NoteWithMeta[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isGraphOpen, setIsGraphOpen] = useState(false);

  const currentId = pathname.split("/").pop();
  const q = searchParams.get("q") || "";

  const [optimisticNotes, addOptimisticNote] = useOptimistic(
    initialNotes,
    (state, { type, note }: { type: "add" | "delete"; note: any }) => {
      if (type === "add") return [note, ...state];
      if (type === "delete") return state.filter((n) => n.id !== note.id);
      return state;
    },
  );

  const filteredNotes = useMemo(() => {
    return optimisticNotes.filter((n) =>
      n.title.toLowerCase().includes(q.toLowerCase()),
    );
  }, [optimisticNotes, q]);

  const handleSearch = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set("q", val);
    else params.delete("q");
    router.replace(`\${pathname}?\${params.toString()}`);
  };

  const handleCreateNote = (isStrategy = false) => {
    startTransition(async () => {
      const tempId = Math.random().toString();
      addOptimisticNote({
        type: "add",
        note: {
          id: tempId,
          title: isStrategy ? "New Strategy" : "Untitled Note",
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      });

      const res = await createNote({
        title: isStrategy ? "New Strategy" : "Untitled Note",
        isStrategyTemplate: isStrategy,
      });

      if (res.data) {
        router.push(`/dashboard/knowledge-base/${res.data.id}`);
      }
    });
  };

  const handleDeleteNote = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure?")) return;

    startTransition(async () => {
      addOptimisticNote({ type: "delete", note: { id } });
      await deleteNote(id);
      if (currentId === id) {
        router.push("/dashboard/knowledge-base");
      }
    });
  };

  return (
    <>
      <aside className="bg-muted/10 flex h-full w-64 shrink-0 flex-col border-r md:w-80">
        <div className="flex flex-col gap-4 border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <BrainCircuit className="text-primary h-5 w-5" />
              <span className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-transparent">
                Second Brain
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full",
                isGraphOpen && "bg-primary text-primary-foreground",
              )}
              onClick={() => setIsGraphOpen(!isGraphOpen)}
            >
              <Network className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-8 flex-1 rounded-xl text-xs"
              onClick={() => handleCreateNote(false)}
              disabled={isPending}
            >
              <Plus className="mr-1 h-3 w-3" /> Note
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 flex-1 rounded-xl text-xs"
              onClick={() => handleCreateNote(true)}
              disabled={isPending}
            >
              <Plus className="mr-1 h-3 w-3" /> Strategy
            </Button>
          </div>

          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
            <Input
              placeholder="Search notes..."
              className="h-9 rounded-xl pl-9 text-sm"
              defaultValue={q}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="flex flex-col gap-1 px-1">
            {filteredNotes.length === 0 ? (
              <div className="text-muted-foreground py-10 text-center text-sm italic opacity-50">
                No results found
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isActive = currentId === note.id;
                return (
                  <Link
                    key={note.id}
                    href={`/dashboard/knowledge-base/${note.id}`}
                    className={cn(
                      "group relative flex flex-col rounded-2xl p-3 transition-all duration-200",
                      isActive
                        ? "bg-primary/10 ring-primary/20 shadow-sm ring-1"
                        : "hover:bg-muted/50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={cn(
                          "flex-1 truncate text-sm font-medium",
                          isActive
                            ? "text-primary"
                            : "text-foreground/80 group-hover:text-foreground",
                        )}
                      >
                        {note.title || "Untitled Note"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => handleDeleteNote(e, note.id)}
                      >
                        <Trash className="text-destructive/70 hover:text-destructive h-3 w-3" />
                      </Button>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] opacity-50">
                      <Clock className="h-3 w-3" />
                      {format(new Date(note.updatedAt), "MMM d, yyyy")}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </ScrollArea>

        {isPending && (
          <div className="bg-background/50 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        )}
      </aside>

      {isGraphOpen && (
        <div className="bg-background/95 animate-in fade-in zoom-in fixed inset-0 z-[100] flex items-center justify-center p-8 backdrop-blur-xl duration-300">
          <div className="bg-card relative h-full w-full overflow-hidden rounded-3xl border shadow-2xl">
            <GraphView
              selectedId={currentId || null}
              onClose={() => setIsGraphOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
