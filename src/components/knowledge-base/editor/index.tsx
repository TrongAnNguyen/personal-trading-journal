"use client";

import Image from "@tiptap/extension-image";
import Mention from "@tiptap/extension-mention";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useState } from "react";
import suggestion from "../suggestion";
import { EditorToolbar } from "./editor-toolbar";
import "./styles.css";

export default function KnowledgeBaseEditor({
  initialContent,
  onChange,
}: {
  initialContent?: string;
  onChange?: (content: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);

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

        if (!coordinates) return;

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

  const editor = useEditor({
    extensions: [
      TextStyleKit,
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
          moved ||
          !event.dataTransfer ||
          !event.dataTransfer.files ||
          !event.dataTransfer.files[0]
        ) {
          return false;
        }

        const file = event.dataTransfer.files[0];
        const isImage = ["image/jpeg", "image/png", "image/webp"].includes(
          file.type,
        );

        if (isImage) {
          event.preventDefault();
          uploadImage(file, view, event);
          return true;
        }

        return false;
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="group relative flex w-full flex-col">
      <EditorToolbar editor={editor} isUploading={isUploading} />
      <EditorContent editor={editor} className="w-full" />
    </div>
  );
}
