// apps/web-editor/src/store/useBuilderStore.ts
import { create } from "zustand";
import type { ComponentData } from "../../types/builder";

interface BuilderState {
  hydrateStore: any;
  components: ComponentData[];
  selectedId: string | null;
  setComponents: (comps: ComponentData[]) => void;
  selectComponent: (id: string | null) => void;
  updateComponentProp: (id: string, key: string, value: any) => void;
  addComponent: (type: ComponentData["type"]) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  components: [],
  selectedId: null,
  hydrateStore: (newComponents: any[]) => set({ components: newComponents }),
  setComponents: (components) => set({ components }),
  selectComponent: (id) => set({ selectedId: id }),
  updateComponentProp: (id, key, value) =>
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, props: { ...c.props, [key]: value } } : c,
      ),
    })),
  addComponent: (type) =>
    set((state) => ({
      components: [
        ...state.components,
        {
          id: crypto.randomUUID(),
          type,
          props: { text: "New Section", backgroundColor: "#000000" },
        },
      ],
    })),
}));
