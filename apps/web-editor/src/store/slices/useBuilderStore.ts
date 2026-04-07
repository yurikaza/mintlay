// store/slices/useBuilderStore.ts
import { create } from "zustand";
import type { NodeData, StyleProps, PageData, CustomComponent, SavedProject, ContractConfig, ContractAction, DataBinding } from "../../types/builder";
import { DEFAULT_STYLES, DEFAULT_PROPS, CONTAINER_TYPES } from "../../types/builder";
import type { ComponentTemplate } from "../builder/prebuilt-components";

const MAX_HISTORY = 50;
const uid = () => crypto.randomUUID();

// ── Helpers ───────────────────────────────────────────────────────────────────

const pushHistory = (past: NodeData[][], current: NodeData[]): NodeData[][] =>
  [...past.slice(-MAX_HISTORY + 1), current];

const collectSubtree = (nodes: NodeData[], rootId: string): NodeData[] => {
  const result: NodeData[] = [];
  const queue = [rootId];
  while (queue.length) {
    const id = queue.shift()!;
    const node = nodes.find((n) => n.id === id);
    if (node) {
      result.push(node);
      nodes.filter((n) => n.parentId === id).forEach((n) => queue.push(n.id));
    }
  }
  return result;
};

const cloneSubtree = (subtree: NodeData[], newParentId: string | null): NodeData[] => {
  const idMap = new Map<string, string>();
  subtree.forEach((n) => idMap.set(n.id, uid()));
  return subtree.map((n) => ({
    ...n,
    id: idMap.get(n.id)!,
    parentId: n.parentId === null ? newParentId : (idMap.get(n.parentId!) ?? newParentId),
    props: { ...n.props },
    style: { ...n.style },
  }));
};

const isAncestorOf = (nodes: NodeData[], ancestorId: string, nodeId: string | null): boolean => {
  let current = nodes.find((n) => n.id === nodeId);
  while (current) {
    if (current.parentId === ancestorId) return true;
    current = nodes.find((n) => n.id === current!.parentId);
  }
  return false;
};

/** Insert nodes at a specific position (before insertBefore, or append). */
const insertAt = (existing: NodeData[], newNodes: NodeData[], insertBefore?: string | null): NodeData[] => {
  if (!insertBefore) return [...existing, ...newNodes];
  const idx = existing.findIndex((n) => n.id === insertBefore);
  if (idx === -1) return [...existing, ...newNodes];
  return [...existing.slice(0, idx), ...newNodes, ...existing.slice(idx)];
};

const DEFAULT_HOME_PAGE: PageData = { id: "page-home", name: "Home", slug: "/" };

// ── State ─────────────────────────────────────────────────────────────────────

interface BuilderState {
  nodes: NodeData[];
  components: NodeData[]; // mirror for hooks/useAutoSave compat
  selectedId: string | null;
  hoveredId: string | null;
  viewport: "desktop" | "tablet" | "mobile";
  isPreviewMode: boolean;
  past: NodeData[][];
  future: NodeData[][];
  pages: PageData[];
  currentPageId: string;
  pageNodes: Record<string, NodeData[]>;
  customComponents: CustomComponent[];
  contracts: ContractConfig[];

  hydrateStore(
    nodes: NodeData[],
    pages?: PageData[],
    pageNodes?: Record<string, NodeData[]>,
    currentPageId?: string,
    customComponents?: CustomComponent[],
    contracts?: ContractConfig[],
  ): void;

  selectNode(id: string | null): void;
  hoverNode(id: string | null): void;
  setViewport(v: "desktop" | "tablet" | "mobile"): void;
  setPreviewMode(on: boolean): void;

  /** Add a single node from the element palette */
  addNode(type: string, parentId: string | null, insertBefore?: string | null): void;

  /** Instantiate a ComponentTemplate into the canvas */
  addFromTemplate(template: ComponentTemplate, parentId: string | null, insertBefore?: string | null): void;

  /** Add a saved custom component */
  addCustomComponent(id: string, parentId: string | null, insertBefore?: string | null): void;

  /** Save the selected subtree as a custom component */
  saveAsComponent(nodeId: string, name: string): void;

  deleteCustomComponent(id: string): void;

  removeNode(id: string): void;
  duplicateNode(id: string): void;

  /** Move a canvas node to a new parent (and optionally before a sibling) */
  moveNode(nodeId: string, newParentId: string | null, insertBefore?: string | null): void;

  updateNodeStyle(id: string, style: Partial<StyleProps>): void;
  updateNodeProp(id: string, key: string, value: any): void;

  undo(): void;
  redo(): void;

  addPage(name: string): void;
  deletePage(id: string): void;
  renamePage(id: string, name: string): void;
  updatePageSlug(id: string, slug: string): void;
  setPageDynamic(id: string, isDynamic: boolean, dynamicParam?: string): void;
  switchPage(id: string): void;

  // ── Contract management ──────────────────────────────────────────────────
  addContract(config: Omit<ContractConfig, "id">): void;
  updateContract(id: string, partial: Partial<Omit<ContractConfig, "id">>): void;
  removeContract(id: string): void;

  // ── Node contract/data bindings ──────────────────────────────────────────
  setContractAction(nodeId: string, action: ContractAction | null): void;
  setDataBinding(nodeId: string, binding: DataBinding): void;
  removeDataBinding(nodeId: string, propKey: string): void;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useBuilderStore = create<BuilderState>((set, get) => ({
  nodes: [],
  components: [],
  selectedId: null,
  hoveredId: null,
  viewport: "desktop",
  isPreviewMode: false,
  past: [],
  future: [],
  pages: [DEFAULT_HOME_PAGE],
  currentPageId: DEFAULT_HOME_PAGE.id,
  pageNodes: { [DEFAULT_HOME_PAGE.id]: [] },
  customComponents: [],
  contracts: [],

  // ── Hydration ──────────────────────────────────────────────────────────────
  hydrateStore(nodes, pages, pageNodes, currentPageId, customComponents, contracts) {
    const resolvedPages = pages ?? [DEFAULT_HOME_PAGE];
    const resolvedCurrentId = currentPageId ?? resolvedPages[0].id;
    const resolvedPageNodes = pageNodes ?? { [resolvedCurrentId]: nodes };
    const resolvedNodes = resolvedPageNodes[resolvedCurrentId] ?? nodes;
    set({
      nodes: resolvedNodes,
      components: resolvedNodes,
      pages: resolvedPages,
      currentPageId: resolvedCurrentId,
      pageNodes: resolvedPageNodes,
      customComponents: customComponents ?? [],
      contracts: contracts ?? [],
      selectedId: null,
      past: [],
      future: [],
    });
  },

  // ── UI ─────────────────────────────────────────────────────────────────────
  selectNode: (id) => set({ selectedId: id }),
  hoverNode: (id) => set({ hoveredId: id }),
  setViewport: (viewport) => set({ viewport }),
  setPreviewMode: (on) => set({ isPreviewMode: on, selectedId: null }),

  // ── Add single node ────────────────────────────────────────────────────────
  addNode(type, parentId, insertBefore) {
    set((state) => {
      const past = pushHistory(state.past, state.nodes);
      const id = uid();
      const node: NodeData = {
        id,
        type,
        parentId,
        props: { ...(DEFAULT_PROPS[type] ?? {}) },
        style: { ...(DEFAULT_STYLES[type] ?? {}) },
      };

      const extras: NodeData[] = [];
      if (type === "Columns2") {
        extras.push(
          { id: uid(), type: "Column", parentId: id, props: {}, style: { ...DEFAULT_STYLES.Column } },
          { id: uid(), type: "Column", parentId: id, props: {}, style: { ...DEFAULT_STYLES.Column } },
        );
      } else if (type === "Columns3") {
        extras.push(
          { id: uid(), type: "Column", parentId: id, props: {}, style: { ...DEFAULT_STYLES.Column } },
          { id: uid(), type: "Column", parentId: id, props: {}, style: { ...DEFAULT_STYLES.Column } },
          { id: uid(), type: "Column", parentId: id, props: {}, style: { ...DEFAULT_STYLES.Column } },
        );
      }

      const nodes = insertAt(state.nodes, [node, ...extras], insertBefore);
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: nodes };
      return { nodes, components: nodes, pageNodes, past, future: [], selectedId: id };
    });
  },

  // ── Add from template ──────────────────────────────────────────────────────
  addFromTemplate(template, parentId, insertBefore) {
    set((state) => {
      const past = pushHistory(state.past, state.nodes);
      const ids = template.nodes.map(() => uid());

      const newNodes: NodeData[] = template.nodes.map((def, i) => ({
        id: ids[i],
        type: def.type,
        parentId: def.parentRef === null ? parentId : ids[def.parentRef],
        props: { ...(DEFAULT_PROPS[def.type] ?? {}), ...(def.props ?? {}) },
        style: { ...(DEFAULT_STYLES[def.type] ?? {}), ...(def.style ?? {}) },
      }));

      const nodes = insertAt(state.nodes, newNodes, insertBefore);
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: nodes };
      return { nodes, components: nodes, pageNodes, past, future: [], selectedId: ids[0] };
    });
  },

  // ── Add custom component ───────────────────────────────────────────────────
  addCustomComponent(componentId, parentId, insertBefore) {
    set((state) => {
      const comp = state.customComponents.find((c) => c.id === componentId);
      if (!comp) return {};
      const past = pushHistory(state.past, state.nodes);
      const cloned = cloneSubtree(comp.nodes, parentId);
      const nodes = insertAt(state.nodes, cloned, insertBefore);
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: nodes };
      return { nodes, components: nodes, pageNodes, past, future: [], selectedId: cloned[0]?.id };
    });
  },

  // ── Save as custom component ───────────────────────────────────────────────
  saveAsComponent(nodeId, name) {
    const state = get();
    const subtree = collectSubtree(state.nodes, nodeId);
    if (!subtree.length) return;

    // Clone with parentId nulled for the root
    const cloned = cloneSubtree(subtree, null);
    const newComp: CustomComponent = {
      id: uid(),
      name,
      createdAt: Date.now(),
      nodes: cloned,
    };
    set({ customComponents: [...state.customComponents, newComp] });
  },

  deleteCustomComponent(id) {
    set((state) => ({
      customComponents: state.customComponents.filter((c) => c.id !== id),
    }));
  },

  // ── Remove ────────────────────────────────────────────────────────────────
  removeNode(id) {
    set((state) => {
      const past = pushHistory(state.past, state.nodes);
      const toRemove = new Set(collectSubtree(state.nodes, id).map((n) => n.id));
      const nodes = state.nodes.filter((n) => !toRemove.has(n.id));
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: nodes };
      return {
        nodes, components: nodes, pageNodes, past, future: [],
        selectedId: state.selectedId === id ? null : state.selectedId,
      };
    });
  },

  // ── Duplicate ─────────────────────────────────────────────────────────────
  duplicateNode(id) {
    set((state) => {
      const original = state.nodes.find((n) => n.id === id);
      if (!original) return {};
      const past = pushHistory(state.past, state.nodes);
      const clones = cloneSubtree(collectSubtree(state.nodes, id), original.parentId);
      // Insert right after the original node
      const idx = state.nodes.findIndex((n) => n.id === id);
      const nodes = [
        ...state.nodes.slice(0, idx + 1),
        ...clones,
        ...state.nodes.slice(idx + 1),
      ];
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: nodes };
      return { nodes, components: nodes, pageNodes, past, future: [], selectedId: clones[0]?.id };
    });
  },

  // ── Move (reparent + reorder) ─────────────────────────────────────────────
  moveNode(nodeId, newParentId, insertBefore) {
    set((state) => {
      if (nodeId === newParentId) return {};
      if (newParentId && isAncestorOf(state.nodes, nodeId, newParentId)) return {};
      const past = pushHistory(state.past, state.nodes);

      const movingNode = state.nodes.find((n) => n.id === nodeId);
      if (!movingNode) return {};

      // Step 1: Remove from current position
      const without = state.nodes.filter((n) => n.id !== nodeId);

      // Step 2: Update its parentId
      const updated = { ...movingNode, parentId: newParentId };

      // Step 3: Insert at target position
      const nodes = insertAt(without, [updated], insertBefore ?? null);
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: nodes };
      return { nodes, components: nodes, pageNodes, past, future: [] };
    });
  },

  // ── Style / Props ─────────────────────────────────────────────────────────
  updateNodeStyle(id, style) {
    set((state) => {
      const past = pushHistory(state.past, state.nodes);
      const nodes = state.nodes.map((n) =>
        n.id === id ? { ...n, style: { ...n.style, ...style } } : n,
      );
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: nodes };
      return { nodes, components: nodes, pageNodes, past, future: [] };
    });
  },

  updateNodeProp(id, key, value) {
    set((state) => {
      const past = pushHistory(state.past, state.nodes);
      const nodes = state.nodes.map((n) =>
        n.id === id ? { ...n, props: { ...n.props, [key]: value } } : n,
      );
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: nodes };
      return { nodes, components: nodes, pageNodes, past, future: [] };
    });
  },

  // ── Undo / Redo ───────────────────────────────────────────────────────────
  undo() {
    set((state) => {
      if (!state.past.length) return {};
      const previous = state.past[state.past.length - 1];
      const past = state.past.slice(0, -1);
      const future = [state.nodes, ...state.future].slice(0, MAX_HISTORY);
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: previous };
      return { nodes: previous, components: previous, pageNodes, past, future };
    });
  },

  redo() {
    set((state) => {
      if (!state.future.length) return {};
      const next = state.future[0];
      const future = state.future.slice(1);
      const past = pushHistory(state.past, state.nodes);
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: next };
      return { nodes: next, components: next, pageNodes, past, future };
    });
  },

  // ── Pages ─────────────────────────────────────────────────────────────────
  addPage(name) {
    set((state) => {
      const id = uid();
      const slug = "/" + name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: state.nodes, [id]: [] };
      return { pages: [...state.pages, { id, name, slug }], pageNodes };
    });
  },

  deletePage(id) {
    set((state) => {
      if (state.pages.length <= 1) return {};
      const newPages = state.pages.filter((p) => p.id !== id);
      const { [id]: _removed, ...newPageNodes } = state.pageNodes;
      let currentPageId = state.currentPageId;
      let nodes = state.nodes;
      if (currentPageId === id) {
        currentPageId = newPages[0].id;
        nodes = newPageNodes[currentPageId] ?? [];
      }
      return { pages: newPages, pageNodes: newPageNodes, currentPageId, nodes, components: nodes, selectedId: null, past: [], future: [] };
    });
  },

  renamePage: (id, name) => set((state) => ({
    pages: state.pages.map((p) => (p.id === id ? { ...p, name } : p)),
  })),

  updatePageSlug: (id, slug) => set((state) => ({
    pages: state.pages.map((p) => (p.id === id ? { ...p, slug } : p)),
  })),

  setPageDynamic: (id, isDynamic, dynamicParam) => set((state) => ({
    pages: state.pages.map((p) =>
      p.id === id ? { ...p, isDynamic, dynamicParam: isDynamic ? (dynamicParam ?? "id") : undefined } : p,
    ),
  })),

  switchPage(id) {
    set((state) => {
      if (id === state.currentPageId) return {};
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: state.nodes };
      const nodes = pageNodes[id] ?? [];
      return { pageNodes, currentPageId: id, nodes, components: nodes, selectedId: null, past: [], future: [] };
    });
  },

  // ── Contract management ──────────────────────────────────────────────────
  addContract(config) {
    set((state) => ({
      contracts: [...state.contracts, { ...config, id: uid() }],
    }));
  },

  updateContract(id, partial) {
    set((state) => ({
      contracts: state.contracts.map((c) => (c.id === id ? { ...c, ...partial } : c)),
    }));
  },

  removeContract(id) {
    set((state) => ({
      contracts: state.contracts.filter((c) => c.id !== id),
    }));
  },

  // ── Node contract/data bindings ──────────────────────────────────────────
  setContractAction(nodeId, action) {
    set((state) => {
      const past = pushHistory(state.past, state.nodes);
      const nodes = state.nodes.map((n) =>
        n.id === nodeId ? { ...n, contractAction: action ?? undefined } : n,
      );
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: nodes };
      return { nodes, components: nodes, pageNodes, past, future: [] };
    });
  },

  setDataBinding(nodeId, binding) {
    set((state) => {
      const past = pushHistory(state.past, state.nodes);
      const nodes = state.nodes.map((n) => {
        if (n.id !== nodeId) return n;
        const existing = (n.dataBindings ?? []).filter((b) => b.propKey !== binding.propKey);
        return { ...n, dataBindings: [...existing, binding] };
      });
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: nodes };
      return { nodes, components: nodes, pageNodes, past, future: [] };
    });
  },

  removeDataBinding(nodeId, propKey) {
    set((state) => {
      const past = pushHistory(state.past, state.nodes);
      const nodes = state.nodes.map((n) =>
        n.id === nodeId
          ? { ...n, dataBindings: (n.dataBindings ?? []).filter((b) => b.propKey !== propKey) }
          : n,
      );
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: nodes };
      return { nodes, components: nodes, pageNodes, past, future: [] };
    });
  },
}));

// ── Global keyboard shortcuts ─────────────────────────────────────────────────
if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => {
    const s = useBuilderStore.getState();
    if (s.isPreviewMode) return;
    if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); s.undo(); }
    if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); s.redo(); }
    if ((e.key === "Delete" || e.key === "Backspace") && s.selectedId &&
      !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement) &&
      !(e.target as HTMLElement)?.isContentEditable) {
      s.removeNode(s.selectedId);
    }
  });
}
