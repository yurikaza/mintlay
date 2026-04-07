import React, { useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useBuilderStore } from "../../store/slices/useBuilderStore";
import { CanvasNode } from "./CanvasNode";
import type { ComponentData } from "../../types/builder";

// apps/web-editor/src/components/builder/BuilderCanvas.tsx

export const BuilderCanvas = ({ projectData, loading }: any) => {
  const { components, hydrateStore } = useBuilderStore();

  // 1. SAFE PARSING LOGIC
  const getInitialComponents = () => {
    try {
      // Check if scripts exists and has at least one entry
      if (projectData?.scripts && projectData.scripts.length > 0) {
        const rawScript = projectData.scripts[0];
        const defaultState: ComponentData[] = [
          {
            id: "root-1",
            type: "Section",
            parentId: null,
            props: { className: "w-full min-h-[300px] bg-zinc-50 p-10" },
          },
        ];

        // If it's a valid string, parse it. If not, return empty array.
        return defaultState;
      }
    } catch (err) {
      console.error("Failed to parse project scripts:", err);
    }
    return []; // Fallback for new projects
  };

  // 2. HYDRATION
  useEffect(() => {
    if (!loading && projectData) {
      const initialData = getInitialComponents();
      // Only hydrate if the store is currently empty to avoid overwriting work
      if (components.length === 0 && initialData.length > 0) {
        hydrateStore(initialData);
      }
    }
  }, [projectData, loading]);

  if (loading) return <div className="p-8 text-zinc-500">Loading...</div>;

  // 3. RENDER FROM STORE (Not from the raw projectData)
  return (
    <div className="flex-1 bg-zinc-900 p-8">
      <div className="w-full max-w-5xl bg-white min-h-screen relative">
        {components.map((comp) => (
          <CanvasNode key={comp.id} node={comp} />
        ))}

        {components.length === 0 && (
          <div className="flex items-center justify-center h-64 text-zinc-400">
            Project is empty. Drag a Section to start.
          </div>
        )}
      </div>
    </div>
  );
};
