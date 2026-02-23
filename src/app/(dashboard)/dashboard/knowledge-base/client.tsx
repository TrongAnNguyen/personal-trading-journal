"use client";

import KnowledgeBaseEditor from "@/components/knowledge-base/editor";
import GraphView from "@/components/knowledge-base/graph-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BrainCircuit,
  Clock,
  Network,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function KnowledgeBaseClient() {
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"editor" | "graph">("editor");
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/kb/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const loadNote = async (id: string) => {
    setSelectedNoteId(id);
    setNoteContent("");
    setNoteTitle("Loading...");
    try {
      const res = await fetch(`/api/kb/notes/\${id}`);
      if (res.ok) {
        const data = await res.json();
        setNoteTitle(data.title);
        setNoteContent(data.content);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createNote = async (isStrategyTemplate = false) => {
    try {
      const res = await fetch("/api/kb/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: isStrategyTemplate ? "New Strategy" : "Untitled Note",
          isStrategyTemplate,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        await fetchNotes();
        loadNote(data.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveNote = async () => {
    if (!selectedNoteId) return;
    try {
      await fetch(`/api/kb/notes/\${selectedNoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: noteTitle, content: noteContent }),
      });
      await fetchNotes();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNote = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/kb/notes/\${id}`, { method: "DELETE" });
      await fetchNotes();
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
        setNoteContent("");
        setNoteTitle("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Debounced save
  useEffect(() => {
    const timer = setTimeout(() => {
      saveNote();
    }, 1000);
    return () => clearTimeout(timer);
  }, [noteContent, noteTitle]);

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <div className="bg-muted/20 flex h-full w-64 shrink-0 flex-col border-r md:w-80">
        <div className="flex flex-col gap-3 border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <BrainCircuit className="text-primary h-5 w-5" />
              Second Brain
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setViewMode(viewMode === "graph" ? "editor" : "graph")
                }
                title="Toggle Graph View"
              >
                <Network className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="default"
              className="h-8 flex-1 text-xs"
              onClick={() => createNote(false)}
            >
              <Plus className="mr-1 h-3 w-3" /> Note
            </Button>
            <Button
              variant="outline"
              className="h-8 flex-1 text-xs"
              onClick={() => createNote(true)}
            >
              <Plus className="mr-1 h-3 w-3" /> Strategy
            </Button>
          </div>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Search notes..."
              className="h-9 pl-8 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 p-2">
          {isLoading ? (
            <div className="text-muted-foreground p-4 text-center text-sm">
              Loading...
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-muted-foreground p-4 text-center text-sm">
              No notes found.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    setViewMode("editor");
                    loadNote(note.id);
                  }}
                  className={`group \${ selectedNoteId === note.id ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 text-muted-foreground" } flex cursor-pointer flex-col rounded-md p-3 transition-colors`}
                >
                  <div className="mb-1 flex items-center justify-between text-sm font-medium">
                    <span
                      className={`\${selectedNoteId === note.id ? 'text-foreground' : 'text-foreground/80'} flex-1 truncate`}
                    >
                      {note.title || "Untitled Note"}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
                      onClick={(e) => deleteNote(e, note.id)}
                    >
                      <Trash className="text-destructive h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] opacity-70">
                    <Clock className="h-3 w-3" />
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="bg-background relative flex h-full flex-1 flex-col overflow-hidden">
        {viewMode === "graph" ? (
          <div className="bg-background/95 absolute inset-0 z-10 flex items-center justify-center p-8 backdrop-blur">
            <div className="bg-card relative h-full w-full overflow-hidden rounded-xl border shadow-sm">
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 z-20 border shadow-md"
                onClick={() => setViewMode("editor")}
              >
                Close Graph
              </Button>
              <GraphView
                selectedId={selectedNoteId}
                onNodeClick={(id) => {
                  loadNote(id);
                  setViewMode("editor");
                }}
              />
            </div>
          </div>
        ) : null}

        {selectedNoteId ? (
          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 overflow-y-auto p-8">
            <Input
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="focus-visible:border-primary h-auto rounded-none border-b border-none bg-transparent px-0 py-2 text-3xl font-bold shadow-none focus-visible:ring-0"
              placeholder="Note Title"
            />

            {/* Using a key forces unmount/remount on ID change so TipTap gets the new initialContent */}
            <KnowledgeBaseEditor
              key={selectedNoteId}
              initialContent={noteContent}
              onChange={setNoteContent}
            />
          </div>
        ) : (
          <div className="text-muted-foreground mx-auto flex max-w-md flex-1 flex-col items-center justify-center p-8 text-center">
            <BrainCircuit className="mb-4 h-16 w-16 opacity-20" />
            <h3 className="text-foreground mb-2 text-xl font-medium">
              Welcome to your Second Brain
            </h3>
            <p className="mb-6 opacity-80">
              Capture your thoughts, document course notes, and build out
              trading strategies. Everything is interconnected.
            </p>
            <div className="flex w-full gap-4">
              <Button onClick={() => createNote(false)} className="flex-1">
                New Note
              </Button>
              <Button
                onClick={() => createNote(true)}
                variant="secondary"
                className="flex-1"
              >
                New Strategy
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
