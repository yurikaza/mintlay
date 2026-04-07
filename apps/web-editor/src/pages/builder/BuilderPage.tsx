// pages/builder/BuilderPage.tsx
import { useParams } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { useBuilderStore } from "../../store/slices/useBuilderStore";
import { useProject } from "../../hooks/useProject";
import { useAutoSave } from "../../hooks/useAutoSave";
import { BuilderSidebar } from "../../components/builder/BuilderSidebar";
import { BuilderCanvas } from "../../components/builder/BuilderCanvas";
import { TopNavbar } from "../../components/builder/TopNavbar";
import { PropertyPanel } from "../../components/builder/PropertyPanel";

export const BuilderPage = () => {
  const { projectId } = useParams();
  const addNode = useBuilderStore((s) => s.addNode);
  const moveNode = useBuilderStore((s) => s.moveNode);
  const nodes = useBuilderStore((s) => s.nodes);
  const isPreviewMode = useBuilderStore((s) => s.isPreviewMode);

  const [activeDrag, setActiveDrag] = useState<{
    label: string;
    isCanvasNode: boolean;
  } | null>(null);

  const { project, loading, error } = useProject(projectId);
  const saveStatus = useAutoSave(projectId, !loading && !!project);

  const handleDragStart = (e: DragStartEvent) => {
    const d = e.active.data.current;
    if (d?.isSidebarItem) {
      setActiveDrag({ label: d.label, isCanvasNode: false });
    } else if (d?.isCanvasNode) {
      const node = nodes.find((n) => n.id === d.nodeId);
      setActiveDrag({ label: node?.type ?? "Element", isCanvasNode: true });
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveDrag(null);

    // Must drop onto a valid container
    if (!over?.data.current?.isContainer) return;
    const newParentId: string | null = over.data.current?.id ?? null;

    const d = active.data.current;

    if (d?.isSidebarItem) {
      // ── Add new element from sidebar ──────────────────────────────────────
      addNode(d.type, newParentId);
    } else if (d?.isCanvasNode) {
      // ── Move existing canvas element ──────────────────────────────────────
      moveNode(d.nodeId, newParentId);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-zinc-500 text-xs font-mono tracking-wider">
            LOADING PROJECT...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-zinc-950 flex items-center justify-center">
        <span className="text-red-500 text-sm font-mono">
          ERROR {error} — COULD NOT LOAD PROJECT
        </span>
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen w-screen flex flex-col bg-zinc-950 overflow-hidden text-zinc-300 font-sans select-none">
        {/* Top bar */}
        <header className="h-11 border-b border-zinc-800 shrink-0 z-20">
          <TopNavbar
            projectName={project?.name ?? "Untitled"}
            saveStatus={saveStatus}
          />
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Left: sidebar (hidden in preview) */}
          {!isPreviewMode && (
            <aside className="w-[220px] border-r border-zinc-800 bg-zinc-950 flex flex-col shrink-0 z-10">
              <BuilderSidebar />
            </aside>
          )}

          {/* Center: canvas */}
          <main
            className="flex-1 overflow-hidden bg-[#1c1c1e]"
            onClick={() => {
              if (!isPreviewMode) useBuilderStore.getState().selectNode(null);
            }}
          >
            <BuilderCanvas />
          </main>

          {/* Right: style panel (hidden in preview) */}
          {!isPreviewMode && (
            <aside className="w-[260px] border-l border-zinc-800 bg-zinc-950 flex flex-col shrink-0 z-10">
              <PropertyPanel />
            </aside>
          )}
        </div>
      </div>

      {/* Drag ghost */}
      <DragOverlay dropAnimation={null}>
        {activeDrag && (
          <div
            className={`px-3 py-1.5 rounded shadow-xl text-xs font-bold uppercase tracking-wider border pointer-events-none ${
              activeDrag.isCanvasNode
                ? "bg-zinc-700 text-zinc-200 border-zinc-500"
                : "bg-purple-600 text-white border-purple-400"
            }`}
          >
            {activeDrag.isCanvasNode ? "↕ " : "+ "}
            {activeDrag.label}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
