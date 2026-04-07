// hooks/useAutoSave.ts
import { useEffect, useState, useRef } from "react";
import { useBuilderStore } from "../store/slices/useBuilderStore";
import { updateProjectData } from "./useProject";
import type { SavedProject } from "../types/builder";

export const useAutoSave = (
  projectId: string | undefined,
  isDataLoaded: boolean,
) => {
  // Watch the full state needed for saving
  const nodes         = useBuilderStore((s) => s.nodes);
  const pages         = useBuilderStore((s) => s.pages);
  const pageNodes     = useBuilderStore((s) => s.pageNodes);
  const currentPageId = useBuilderStore((s) => s.currentPageId);

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!isDataLoaded) return;
    if (isInitialLoad.current) { isInitialLoad.current = false; return; }
    if (!projectId) return;

    setSaveStatus("saving");

    const timer = setTimeout(async () => {
      try {
        // Save full multi-page state
        const saved: SavedProject = {
          version: 2,
          pages,
          // Merge in latest nodes for the current page before saving
          pageNodes: { ...pageNodes, [currentPageId]: nodes },
          currentPageId,
        };
        await updateProjectData(projectId, saved);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [nodes, pages, pageNodes, isDataLoaded, projectId]);

  return saveStatus;
};
