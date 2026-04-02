// apps/web-editor/src/hooks/useAutoSave.ts
import { useEffect, useState, useRef } from "react";
import { useBuilderStore } from "../store/slices/useBuilderStore";
import { updateProjectData } from "./useProject";

export const useAutoSave = (
  projectId: string | undefined,
  isDataLoaded: boolean,
) => {
  // Listen to the master components array from Zustand
  const components = useBuilderStore((state) => state.components);

  // Track the visual status for your UI
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  // Prevent saving the moment the page loads before data is fully fetched
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!isDataLoaded) return;

    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    if (!projectId) return;

    // The user made a change! Show "saving..."
    setSaveStatus("saving");

    // Start a 1.5-second countdown
    const timer = setTimeout(async () => {
      try {
        await updateProjectData(projectId, components);
        setSaveStatus("saved");

        // Clear the "saved" message after 2 seconds
        setTimeout(() => setSaveStatus("idle"), 2000);
        console.log("ARCHITECT_DATA_AUTO_SYNCED");
      } catch (error) {
        console.error("AUTO_SYNC_FAILURE:", error);
        setSaveStatus("error");
      }
    }, 1500);

    // CLEANUP: If the user makes another change BEFORE the 1.5 seconds is up,
    // this cancels the old timer and starts a new one. (This is the magic of debouncing).
    return () => clearTimeout(timer);
  }, [components, isDataLoaded, projectId]); // This useEffect runs every time `components` changes

  return saveStatus;
};
