// apps/web-editor/src/pages/builder/BuilderPage.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useBuilderStore } from "../../store/slices/useBuilderStore";
import { updateProjectData, useProject } from "../../hooks/useProject";
import { BuilderSidebar } from "../../components/builder/BuilderSidebar";
import { BuilderCanvas } from "../../components/builder/BuilderCanvas";

// import { TopNavbar } from "../../components/builder/TopNavbar";
// import { PropertyPanel } from "../../components/builder/PropertyPanel";

export const BuilderPage = () => {
  const { projectId } = useParams();
  const addComponent = useBuilderStore((state) => state.addComponent);
  const components = useBuilderStore((state) => state.components);
  const [activeDragItem, setActiveDragItem] = useState<{
    type: string;
    label: string;
  } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const { project, loading, error } = useProject(projectId!);

  // Triggered when the user starts dragging from the sidebar
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.isSidebarItem) {
      setActiveDragItem({
        type: active.data.current.type,
        label: active.data.current.label,
      });
    }
  };

  // Triggered when the user drops the item
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null); // Remove the ghost overlay

    // Check if it was dropped over the canvas
    if (over && over.data.current?.isContainer) {
      const type = active.data.current?.type;
      const targetId = over.data.current?.id; // Will be 'null' for root, or an 'id' for a Section/Div

      const targetNode = useBuilderStore
        .getState()
        .components.find((c) => c.id === targetId);
      const finalParentId =
        targetNode?.type === "Section" ? targetId : targetNode?.parentId;

      if (type) {
        // 1. Add to Zustand store instantly
        addComponent(type, finalParentId);

        // 2. Sync to Go Backend
        if (projectId) {
          try {
            setIsSyncing(true);
            const updatedComps = useBuilderStore.getState().components;
            console.log("SYNCING_PROJECT_UPDATE:", updatedComps);

            await updateProjectData(projectId, updatedComps);
          } catch (err) {
            console.error("SYNC_FAILURE:", err);
          } finally {
            setIsSyncing(false);
          }
        }
      }
    }
  };

  if (loading) return <div>Loading project...</div>;
  if (error) return <div>Error loading project: {error}</div>;

  console.log(components, JSON.parse(project.scripts[0]));

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className="h-full w-screen flex flex-col bg-zinc-950 overflow-hidden text-zinc-300 font-sans">
        {/* <header className="h-12 border-b border-zinc-800 bg-zinc-950 flex shrink-0 z-10"><TopNavbar /></header> */}

        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: Sidebar */}
          <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col shrink-0 z-10">
            <BuilderSidebar isSyncing={isSyncing} />
          </aside>

          {/* CENTER: Canvas */}
          <main className="flex-1 relative overflow-hidden flex flex-col bg-zinc-900">
            <BuilderCanvas projectData={project} />
          </main>

          {/* RIGHT: Property Panel */}
          {/* <aside className="w-72 border-l border-zinc-800 bg-zinc-950 flex flex-col shrink-0 z-10"><PropertyPanel /></aside> */}
        </div>
      </div>

      {/* The Visual Ghost that follows the mouse while dragging */}
      <DragOverlay dropAnimation={null}>
        {activeDragItem ? (
          <div className="p-3 bg-purple-600 text-white rounded shadow-2xl opacity-90 font-bold text-xs uppercase tracking-wider border border-purple-400">
            {activeDragItem.label}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
