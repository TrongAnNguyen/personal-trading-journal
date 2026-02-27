"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Quote,
} from "lucide-react";
import { memo } from "react";
import { menuBarStateSelector } from "./menuBarState";
import { ToolbarButton } from "./toolbar-button";

interface EditorToolbarProps {
  editor: Editor;
  isUploading: boolean;
}

export const EditorToolbar = memo(
  ({ editor, isUploading }: EditorToolbarProps) => {
    const editorState = useEditorState({
      editor,
      selector: menuBarStateSelector,
    });

    if (!editor || !editorState) {
      return null;
    }

    return (
      <div className="bg-background/80 sticky top-0 z-30 mx-auto mb-8 flex w-fit items-center gap-1 rounded-2xl border p-1.5 opacity-0 shadow-xl backdrop-blur-md transition-all duration-300 group-focus-within:opacity-100 focus-within:opacity-100 hover:opacity-100">
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editorState.isHeading1}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editorState.isHeading2}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <div className="bg-border mx-1 h-4 w-[1px]" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editorState.isBold}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editorState.isItalic}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editorState.isCode}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <div className="bg-border mx-1 h-4 w-[1px]" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editorState.isBulletList}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editorState.isOrderedList}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editorState.isBlockquote}
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
          <div className="text-muted-foreground ml-1 flex animate-pulse items-center gap-2 border-l px-3 text-[10px] font-medium">
            <Loader2 className="h-3 w-3 animate-spin" />
            Uploading...
          </div>
        )}
      </div>
    );
  },
);

EditorToolbar.displayName = "EditorToolbar";
