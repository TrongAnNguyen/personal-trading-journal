"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Mention from "@tiptap/extension-mention";
import { useCallback, useState } from "react";
import suggestion from "./suggestion";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Loader2,
} from "lucide-react";

export default function KnowledgeBaseEditor({
  initialContent,
  onChange,
}: {
  initialContent?: string;
  onChange?: (content: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: "rounded-xl border shadow-lg max-w-full h-auto my-8",
        },
      }),
      Mention.configure({
        HTMLAttributes: {
          class:
            "mention bg-primary/10 text-primary rounded-md px-1.5 py-0.5 font-medium border border-primary/20",
        },
        suggestion,
      }),
    ],
    content: initialContent || "<p>Start typing your notes here...</p>",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert focus:outline-none min-h-[500px] max-w-none w-full pb-32",
      },
      handleDrop: (view, event, slice, moved) => {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          const file = event.dataTransfer.files[0];
          if (
            file.type === "image/jpeg" ||
            file.type === "image/png" ||
            file.type === "image/webp"
          ) {
            event.preventDefault();
            uploadImage(file, view, event);
            return true;
          }
        }
        return false;
      },
    },
    immediatelyRender: false,
  });

  const uploadImage = useCallback(
    async (file: File, view: any, event: DragEvent) => {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const { url } = await response.json();

        const { schema } = view.state;
        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });
        const node = schema.nodes.image.create({ src: url });
        const transaction = view.state.tr.insert(coordinates.pos, node);
        view.dispatch(transaction);
      } catch (error) {
        console.error("Failed to upload image:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "hover:bg-muted text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="group relative flex w-full flex-col">
      {/* Floating Toolbar */}
      <div className="bg-background/80 sticky top-0 z-30 mx-auto mb-8 flex w-fit items-center gap-1 rounded-2xl border p-1.5 opacity-0 shadow-xl backdrop-blur-md transition-all duration-300 group-focus-within:opacity-100 focus-within:opacity-100 hover:opacity-100">
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <div className="bg-border mx-1 h-4 w-[1px]" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <div className="bg-border mx-1 h-4 w-[1px]" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <div className="bg-border mx-1 h-4 w-[1px]" />

        <ToolbarButton
          onClick={() => {
            const url = window.prompt("Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          title="Add Image"
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>

        {isUploading && (
          <div className="text-muted-foreground flex animate-pulse items-center gap-2 px-3 text-[10px] font-medium">
            <Loader2 className="h-3 w-3 animate-spin" />
            Uploading...
          </div>
        )}
      </div>

      <EditorContent editor={editor} className="w-full" />
    </div>
  );
}
