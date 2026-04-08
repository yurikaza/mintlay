// pages/builder/BuilderPage.tsx
import { useParams } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
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
import { NftDeployBanner } from "../../components/builder/NftDeployBanner";
import { COMPONENT_TEMPLATES } from "../../components/builder/prebuilt-components";

export const BuilderPage = () => {
  const { projectId } = useParams();
  const addNode          = useBuilderStore((s) => s.addNode);
  const moveNode         = useBuilderStore((s) => s.moveNode);
  const addFromTemplate  = useBuilderStore((s) => s.addFromTemplate);
  const addCustomComponent = useBuilderStore((s) => s.addCustomComponent);
  const nodes            = useBuilderStore((s) => s.nodes);
  const isPreviewMode    = useBuilderStore((s) => s.isPreviewMode);

  const [activeDrag, setActiveDrag] = useState<{ label: string; kind: "sidebar" | "canvas" | "component" } | null>(null);

  // ── Sensors: require 8px movement before activating drag ─────────────────
  // This is the key fix — without this, clicks accidentally trigger drags
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
  );

  const { project, loading, error } = useProject(projectId);
  const saveStatus = useAutoSave(projectId, !loading && !!project);

  // ── Drag start ────────────────────────────────────────────────────────────
  const handleDragStart = (e: DragStartEvent) => {
    const d = e.active.data.current;
    if (d?.isSidebarItem) {
      setActiveDrag({ label: d.label, kind: "sidebar" });
    } else if (d?.isComponentTemplate || d?.isCustomComponent) {
      setActiveDrag({ label: d.label ?? "Component", kind: "component" });
    } else if (d?.isCanvasNode) {
      const node = nodes.find((n) => n.id === d.nodeId);
      setActiveDrag({ label: node?.type ?? "Element", kind: "canvas" });
    }
  };

  // ── Drag end ──────────────────────────────────────────────────────────────
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveDrag(null);
    if (!over) return;

    const d    = active.data.current;
    const dest = over.data.current;

    // Resolve parent + insertBefore from either a container drop or an insert-zone drop
    let parentId: string | null;
    let insertBefore: string | null | undefined;

    if (dest?.isInsertZone) {
      parentId     = dest.parentId;
      insertBefore = dest.insertBefore ?? null;
    } else if (dest?.isContainer) {
      parentId     = dest.id ?? null;
      insertBefore = undefined; // append
    } else {
      return; // dropped nowhere useful
    }

    if (d?.isSidebarItem) {
      addNode(d.type, parentId, insertBefore);
    } else if (d?.isComponentTemplate) {
      const tpl = COMPONENT_TEMPLATES.find((t) => t.id === d.templateId);
      if (tpl) addFromTemplate(tpl, parentId, insertBefore);
    } else if (d?.isCustomComponent) {
      addCustomComponent(d.componentId, parentId, insertBefore);
    } else if (d?.isCanvasNode) {
      moveNode(d.nodeId, parentId, insertBefore);
    } else if (d?.isLayerNode) {
      // Drag from layers panel
      moveNode(d.nodeId, parentId, insertBefore);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-zinc-500 text-xs font-mono tracking-wider">LOADING PROJECT...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-zinc-950 flex items-center justify-center">
        <span className="text-red-500 text-sm font-mono">ERROR {error} — COULD NOT LOAD PROJECT</span>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen w-screen flex flex-col bg-zinc-950 overflow-hidden text-zinc-300 font-sans select-none">
        <header className="h-11 border-b border-zinc-800 shrink-0 z-20">
          <TopNavbar projectName={project?.name ?? "Untitled"} saveStatus={saveStatus} />
        </header>

        <NftDeployBanner />

        <div className="flex-1 flex overflow-hidden">
          {!isPreviewMode && (
            <aside className="w-[220px] border-r border-zinc-800 bg-zinc-950 flex flex-col shrink-0 z-10">
              <BuilderSidebar />
            </aside>
          )}

          <main
            className="flex-1 overflow-hidden bg-[#1c1c1e]"
            onClick={() => { if (!isPreviewMode) useBuilderStore.getState().selectNode(null); }}
          >
            <BuilderCanvas />
          </main>

          {!isPreviewMode && (
            <aside className="w-[260px] border-l border-zinc-800 bg-zinc-950 flex flex-col shrink-0 z-10">
              <PropertyPanel />
            </aside>
          )}
        </div>
      </div>

      {/* Drag overlay ghost */}
      <DragOverlay dropAnimation={null}>
        {activeDrag && (
          <div
            className={`px-3 py-1.5 rounded shadow-xl text-xs font-bold uppercase tracking-wider border pointer-events-none ${
              activeDrag.kind === "canvas"
                ? "bg-zinc-700 text-zinc-200 border-zinc-500"
                : activeDrag.kind === "component"
                  ? "bg-emerald-700 text-white border-emerald-500"
                  : "bg-purple-600 text-white border-purple-400"
            }`}
          >
            {activeDrag.kind === "canvas" ? "↕ " : activeDrag.kind === "component" ? "⊞ " : "+ "}
            {activeDrag.label}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
