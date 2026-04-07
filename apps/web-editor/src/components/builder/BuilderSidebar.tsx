// apps/web-editor/src/components/builder/BuilderSidebar.tsx
import React, { useState } from "react";
import { Plus, FileText, Layers, Layout, Box, Loader2 } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";

type TabType = "elements" | "pages" | "navigator";

export const BuilderSidebar = ({ isSyncing }: { isSyncing: boolean }) => {
  const [activeTab, setActiveTab] = useState<TabType>("elements");

  return (
    <div className="flex h-full w-full">
      {/* NARROW ICON RAIL */}
      <div className="w-12 h-full border-r border-zinc-800/50 flex flex-col items-center py-4 gap-4 shrink-0 bg-zinc-950">
        <TabIcon
          icon={<Plus />}
          active={activeTab === "elements"}
          onClick={() => setActiveTab("elements")}
        />
        <TabIcon
          icon={<FileText />}
          active={activeTab === "pages"}
          onClick={() => setActiveTab("pages")}
        />
        <TabIcon
          icon={<Layers />}
          active={activeTab === "navigator"}
          onClick={() => setActiveTab("navigator")}
        />
      </div>

      {/* PANEL CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#18181b]">
        {activeTab === "elements" && (
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Add Elements
              </h2>
              {isSyncing && (
                <Loader2 className="w-3 h-3 animate-spin text-zinc-500" />
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              <div>
                <h3 className="text-[11px] text-zinc-500 mb-2 uppercase font-mono">
                  Structure
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <DraggableElement
                    type="Hero"
                    label="Hero"
                    icon={<Layout />}
                  />
                  <DraggableElement
                    type="Footer"
                    label="Footer"
                    icon={<Box />}
                  />
                  <DraggableElement
                    type="TextSection"
                    label="Section"
                    icon={<Box />}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pages and Navigator UI remains the same... */}
      </div>
    </div>
  );
};

// --- DRAGGABLE BUTTON COMPONENT ---
const DraggableElement = ({
  type,
  label,
  icon,
}: {
  type: string;
  label: string;
  icon: any;
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: { type, label, isSidebarItem: true }, // Sends data to BuilderPage
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex flex-col items-center justify-center p-3 bg-zinc-900 border rounded cursor-grab active:cursor-grabbing transition-all group 
      ${isDragging ? "opacity-50 border-purple-500" : "border-zinc-800 hover:bg-zinc-800 hover:border-purple-500/50"}`}
    >
      <div className="text-zinc-500 group-hover:text-purple-400 mb-2 [&>svg]:w-5 [&>svg]:h-5 transition-colors">
        {icon}
      </div>
      <span className="text-[10px] text-zinc-400 group-hover:text-zinc-200 uppercase font-bold">
        {label}
      </span>
    </div>
  );
};

const TabIcon = ({
  icon,
  active,
  onClick,
}: {
  icon: any;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-md transition-colors ${active ? "text-white bg-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
  >
    {React.cloneElement(icon, { className: "w-5 h-5" })}
  </button>
);
