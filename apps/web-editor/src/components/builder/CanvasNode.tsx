import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { useBuilderStore } from "../../store/slices/useBuilderStore";

export const CanvasNode = ({ node }: { node: any }) => {
  const { components, selectedId, selectComponent } = useBuilderStore();
  const children = components.filter((c) => c.parentId === node.id);

  // This node itself is a droppable container
  const { setNodeRef, isOver } = useDroppable({
    id: `container-${node.id}`,
    data: { type: "container", id: node.id },
  });

  return (
    <div
      ref={setNodeRef}
      onClick={(e) => {
        e.stopPropagation();
        selectComponent(node.id);
      }}
      className={`${node.props.className} ${
        selectedId === node.id ? "ring-2 ring-purple-500" : ""
      } ${isOver ? "bg-purple-50" : ""}`}
    >
      {/* If this is a Flex-Row container, children will naturally sit side-to-side */}
      {children.map((child) => (
        <CanvasNode key={child.id} node={child} />
      ))}

      {/* Helper UI: Show a plus button or hint if empty */}
      {children.length === 0 && (
        <div className="flex-1 flex items-center justify-center border border-dashed border-zinc-300 min-h-[80px] text-[10px] text-zinc-400 uppercase font-mono">
          Empty_{node.type}
        </div>
      )}
    </div>
  );
};
