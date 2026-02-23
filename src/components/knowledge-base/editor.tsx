"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Mention from "@tiptap/extension-mention";
import { useCallback, useState } from "react";
import suggestion from "./suggestion";

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
      StarterKit,
      Image.configure({
        inline: true,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention bg-blue-100 text-blue-800 rounded px-1",
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
          "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none min-h-[300px]",
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
        alert("Image upload failed.");
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-background relative rounded-md border p-4">
      {isUploading && (
        <div className="bg-muted absolute top-2 right-2 rounded px-2 py-1 text-xs">
          Uploading image...
        </div>
      )}
      <div className="mb-4 flex gap-2 border-b pb-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`\${editor.isActive('bold') ? 'bg-muted' : ''} rounded-sm px-2 py-1 text-sm`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`\${editor.isActive('italic') ? 'bg-muted' : ''} rounded-sm px-2 py-1 text-sm`}
        >
          Italic
        </button>
        <button
          onClick={() => {
            const url = window.prompt("URL");
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          className="rounded-sm px-2 py-1 text-sm"
        >
          Image
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
