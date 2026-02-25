import { searchKB } from "@/lib/actions/knowledge-base";
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import MentionList from "./mention-list";

export default {
  char: "[[",
  items: async ({ query }: { query: string }) => {
    if (query.length < 1) return [];
    try {
      return await searchKB(query);
    } catch (e) {
      return [];
    }
  },

  render: () => {
    let component: ReactRenderer;
    let popup: any;

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: any) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: any) {
        if (props.event.key === "Escape") {
          popup[0].hide();
          return true;
        }
        // @ts-ignore
        return component?.ref?.onKeyDown(props);
      },

      onExit() {
        if (popup) {
          popup[0].destroy();
        }
        if (component) {
          component.destroy();
        }
      },
    };
  },
};
