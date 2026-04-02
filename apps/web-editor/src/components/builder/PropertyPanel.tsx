// apps/web-editor/src/components/builder/PropertyPanel.tsx

import { useBuilderStore } from "../../store/slices/useBuilderStore";

export const PropertyPanel = ({ saveStatus }: { saveStatus: string }) => {
  const { components, selectedId, updateComponentProp } = useBuilderStore();
  const selectedComponent = components.find((c) => c.id === selectedId);

  if (!selectedComponent)
    return (
      <div className="p-4 text-zinc-500 italic">SELECT_A_NODE_TO_EDIT</div>
    );

  return (
    <div>
      <div className="h-10 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6">
        <span className="text-xs font-mono text-zinc-500">CANVAS_ACTIVE</span>

        {/* Save Status Indicator */}
        <span
          className={`text-[10px] uppercase font-bold tracking-widest ${
            saveStatus === "saving"
              ? "text-yellow-500 animate-pulse"
              : saveStatus === "saved"
                ? "text-green-500"
                : saveStatus === "error"
                  ? "text-red-500"
                  : "text-transparent"
          }`}
        >
          {saveStatus === "saving"
            ? "Syncing..."
            : saveStatus === "saved"
              ? "System_Synced"
              : saveStatus === "error"
                ? "Sync_Failed"
                : ""}
        </span>
      </div>

      <div className="w-80 bg-zinc-900 border-l border-zinc-800 p-6">
        <h3 className="text-sm font-black italic mb-6 uppercase">
          Node_Properties
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase text-zinc-500 font-bold">
              Background Color
            </label>
            <input
              type="color"
              value={selectedComponent.props.backgroundColor || "#000000"}
              onChange={(e) =>
                updateComponentProp(
                  selectedComponent.id,
                  "backgroundColor",
                  e.target.value,
                )
              }
              className="w-full h-10 bg-black border border-zinc-700 mt-1 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
