// apps/web-editor/src/components/builder/BuilderSidebar.tsx
import { updateProjectData } from "../../hooks/useProject";
import { useBuilderStore } from "../../store/slices/useBuilderStore";
import { useParams } from "react-router-dom";

export const BuilderSidebar = () => {
  const { projectId } = useParams();
  const addComponent = useBuilderStore((state) => state.addComponent);
  const components = useBuilderStore((state) => state.components);

  const handleAddComponent = async (type: any) => {
    // 1. Add to local state
    addComponent(type);

    // 2. Sync with Go Project Service
    // We use the updated state from the store
    if (projectId) {
      try {
        // Note: useBuilderStore.getState() gets the latest data
        // immediately after the addComponent call
        const updatedComps = useBuilderStore.getState().components;
        await updateProjectData(projectId, updatedComps);
        console.log("ARCHITECT_DATA_SYNCED");
      } catch (err) {
        console.error("SYNC_FAILURE:", err);
      }
    }
  };

  const sections = [
    { type: "Hero", label: "Main Hero" },
    { type: "TextSection", label: "Content Block" },
    { type: "Footer", label: "Site Footer" },
  ];

  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 p-4">
      <h3 className="text-[10px] font-bold text-zinc-500 mb-4 uppercase">
        Add_Elements
      </h3>
      <div className="space-y-2">
        {sections.map((s) => (
          <button
            key={s.type}
            onClick={() => handleAddComponent(s.type)}
            className="w-full bg-zinc-800 hover:bg-purple-600 p-3 text-left text-xs font-bold transition-all"
          >
            + {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};
