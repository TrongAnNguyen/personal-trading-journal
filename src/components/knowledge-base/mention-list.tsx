import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

const MentionList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item.id, label: item.label });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length,
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }
      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }
      if (event.key === "Enter") {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  if (!props.items.length) {
    return (
      <div className="bg-popover text-popover-foreground z-50 min-w-40 rounded-md border p-2 text-sm shadow-md">
        No results
      </div>
    );
  }

  return (
    <div className="bg-popover text-popover-foreground z-50 max-h-60 min-w-48 overflow-hidden overflow-y-auto rounded-md border p-1 shadow-md">
      {props.items.map((item: any, index: number) => (
        <button
          key={index}
          onClick={() => selectItem(index)}
          className={`hover:bg-accent hover:text-accent-foreground \${ index === selectedIndex ? 'bg-accent text-accent-foreground' : '' } w-full rounded-sm px-2 py-1.5 text-left text-sm`}
        >
          <div className="truncate font-medium">{item.label}</div>
          <div className="text-muted-foreground text-xs">{item.type}</div>
        </button>
      ))}
    </div>
  );
});

MentionList.displayName = "MentionList";

export default MentionList;
