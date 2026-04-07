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
  addComponent: (type: string, parentId?: string | null) => void;
  reorderComponents: (startIndex: number, endIndex: number) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  components: [],
  selectedId: null,
  hydrateStore: (newComponents: any[]) => set({ components: newComponents }),
  setComponents: (components) => set({ components }),
  selectComponent: (id) => set({ selectedId: id }),
  reorderComponents: (startIndex: number, endIndex: number) =>
    set((state) => {
      const result = Array.from(state.components);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { components: result };
    }),
  updateComponentProp: (id, key, value) =>
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, props: { ...c.props, [key]: value } } : c,
      ),
    })),
  addComponent: (type, parentId = null) =>
    set((state) => {
      const id = crypto.randomUUID();
      let defaultProps: any = { className: "p-4 min-h-[50px] relative" };

      // Section: Vertical stack by default
      if (type === "Section") {
        defaultProps.className =
          "w-full p-8 min-h-[200px] bg-white border border-zinc-200 flex flex-col gap-4";
      }
      // Div: Horizontal/Grid by default to allow side-to-side
      else if (type === "Div") {
        defaultProps.className =
          "flex-1 p-6 border border-dashed border-zinc-300 bg-zinc-50/30 flex flex-row gap-2 min-w-[100px]";
      }

      return {
        components: [
          ...state.components,
          { id, type, parentId, props: defaultProps },
        ],
      };
    }),
}));
