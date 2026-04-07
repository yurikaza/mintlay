// components/builder/BuilderCanvas.tsx
import { useDroppable } from "@dnd-kit/core";
import { useBuilderStore } from "../../store/slices/useBuilderStore";
import { CanvasNode } from "./CanvasNode";

const VIEWPORT_WIDTH: Record<string, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

export const BuilderCanvas = () => {
  const nodes = useBuilderStore((s) => s.nodes);
  const viewport = useBuilderStore((s) => s.viewport);

  // The canvas body itself is a drop target for top-level Sections
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-root",
    data: { isContainer: true, id: null },
  });

  const rootNodes = nodes.filter((n) => n.parentId === null);

  return (
    <div className="h-full overflow-auto flex justify-center p-6">
      {/* Viewport frame */}
      <div
        style={{
          width: VIEWPORT_WIDTH[viewport],
          transition: "width 0.3s ease",
        }}
        className="relative flex flex-col"
      >
        {/* Viewport label */}
        <div className="flex items-center justify-center mb-2">
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            {viewport} —{" "}
            {viewport === "desktop"
              ? "1440px"
              : viewport === "tablet"
                ? "768px"
                : "390px"}
          </span>
        </div>

        {/* White page surface */}
        <div
          ref={setNodeRef}
          className={`flex-1 bg-white min-h-screen shadow-2xl transition-colors ${
            isOver && rootNodes.length === 0
              ? "outline-2 outline-purple-400"
              : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {rootNodes.map((node) => (
            <CanvasNode key={node.id} nodeId={node.id} />
          ))}

          {rootNodes.length === 0 && (
            <div
              className={`flex flex-col items-center justify-center h-64 gap-3 transition-colors ${
                isOver ? "bg-purple-50" : "bg-white"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 border-dashed transition-colors ${
                  isOver ? "border-purple-400 bg-purple-50" : "border-zinc-300"
                }`}
              >
                <span
                  className={`text-2xl transition-colors ${isOver ? "text-purple-400" : "text-zinc-400"}`}
                >
                  +
                </span>
              </div>
              <p
                className={`text-sm transition-colors ${isOver ? "text-purple-500 font-medium" : "text-zinc-400"}`}
              >
                {isOver ? "Drop here" : "Drag a Section to get started"}
              </p>
              <p className="text-xs text-zinc-400 text-center max-w-[240px]">
                Add Sections first, then place Containers, Divs and elements
                inside them.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
