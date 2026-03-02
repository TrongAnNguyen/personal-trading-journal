"use client";

import { type Content } from "@tiptap/core";
import { SimpleEditor } from "../tiptap-editor/tiptap-templates/simple/simple-editor";

export default function KnowledgeBaseEditor({
  initialContent,
  onChange,
}: {
  initialContent?: Content;
  onChange?: (content: Content) => void;
}) {
  return <SimpleEditor initialContent={initialContent} onChange={onChange} />;
}
