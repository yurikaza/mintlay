// store/slices/useBuilderStore.ts
import { create } from "zustand";
import type { NodeData, StyleProps, PageData } from "../../types/builder";
import { DEFAULT_STYLES, DEFAULT_PROPS, CONTAINER_TYPES } from "../../types/builder";

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
    parentId:
      n.parentId === null
        ? newParentId
        : (idMap.get(n.parentId!) ?? newParentId),
    props: { ...n.props },
    style: { ...n.style },
  }));
};

/** Check if `ancestorId` is an ancestor of `nodeId` in the tree. */
const isAncestorOf = (
  nodes: NodeData[],
  ancestorId: string,
  nodeId: string | null,
): boolean => {
  let current = nodes.find((n) => n.id === nodeId);
  while (current) {
    if (current.parentId === ancestorId) return true;
    current = nodes.find((n) => n.id === current!.parentId);
  }
  return false;
};

const DEFAULT_HOME_PAGE: PageData = { id: "page-home", name: "Home", slug: "/" };

// ── State interface ───────────────────────────────────────────────────────────

interface BuilderState {
  // Active page nodes
  nodes: NodeData[];
  components: NodeData[]; // mirror for backward compat

  // Selection & hover
  selectedId: string | null;
  hoveredId: string | null;

  // Viewport
  viewport: "desktop" | "tablet" | "mobile";

  // Preview mode (buttons become functional)
  isPreviewMode: boolean;

  // History (per active page)
  past: NodeData[][];
  future: NodeData[][];

  // ── Pages ─────────────────────────────────────────────────────────────────
  pages: PageData[];
  currentPageId: string;
  pageNodes: Record<string, NodeData[]>;

  // ── Actions ───────────────────────────────────────────────────────────────
  hydrateStore: (
    nodes: NodeData[],
    pages?: PageData[],
    pageNodes?: Record<string, NodeData[]>,
    currentPageId?: string,
  ) => void;

  selectNode: (id: string | null) => void;
  hoverNode: (id: string | null) => void;
  setViewport: (v: "desktop" | "tablet" | "mobile") => void;
  setPreviewMode: (on: boolean) => void;

  addNode: (type: string, parentId: string | null) => void;
  removeNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  moveNode: (nodeId: string, newParentId: string | null) => void;

  updateNodeStyle: (id: string, style: Partial<StyleProps>) => void;
  updateNodeProp: (id: string, key: string, value: any) => void;

  undo: () => void;
  redo: () => void;

  // Pages
  addPage: (name: string) => void;
  deletePage: (id: string) => void;
  renamePage: (id: string, name: string) => void;
  updatePageSlug: (id: string, slug: string) => void;
  switchPage: (id: string) => void;
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

  // ── Hydration ─────────────────────────────────────────────────────────────
  hydrateStore: (nodes, pages, pageNodes, currentPageId) => {
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
      selectedId: null,
      past: [],
      future: [],
    });
  },

  // ── UI state ──────────────────────────────────────────────────────────────
  selectNode: (id) => set({ selectedId: id }),
  hoverNode: (id) => set({ hoveredId: id }),
  setViewport: (viewport) => set({ viewport }),
  setPreviewMode: (on) => set({ isPreviewMode: on, selectedId: null }),

  // ── Add ───────────────────────────────────────────────────────────────────
  addNode: (type, parentId) =>
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

      const nodes = [...state.nodes, node, ...extras];
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: nodes };
      return { nodes, components: nodes, pageNodes, past, future: [], selectedId: id };
    }),

  // ── Remove ────────────────────────────────────────────────────────────────
  removeNode: (id) =>
    set((state) => {
      const past = pushHistory(state.past, state.nodes);
      const toRemove = new Set(collectSubtree(state.nodes, id).map((n) => n.id));
      const nodes = state.nodes.filter((n) => !toRemove.has(n.id));
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: nodes };
      return {
        nodes, components: nodes, pageNodes, past, future: [],
        selectedId: state.selectedId === id ? null : state.selectedId,
      };
    }),

  // ── Duplicate ─────────────────────────────────────────────────────────────
  duplicateNode: (id) =>
    set((state) => {
      const original = state.nodes.find((n) => n.id === id);
      if (!original) return {};
      const past = pushHistory(state.past, state.nodes);
      const clones = cloneSubtree(collectSubtree(state.nodes, id), original.parentId);
      const nodes = [...state.nodes, ...clones];
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: nodes };
      return { nodes, components: nodes, pageNodes, past, future: [], selectedId: clones[0]?.id ?? state.selectedId };
    }),

  // ── Move (reparent) ───────────────────────────────────────────────────────
  moveNode: (nodeId, newParentId) =>
    set((state) => {
      // Guard: can't drop onto self or own descendants
      if (nodeId === newParentId) return {};
      if (newParentId && isAncestorOf(state.nodes, nodeId, newParentId)) return {};
      const past = pushHistory(state.past, state.nodes);
      const nodes = state.nodes.map((n) =>
        n.id === nodeId ? { ...n, parentId: newParentId } : n,
      );
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: nodes };
      return { nodes, components: nodes, pageNodes, past, future: [] };
    }),

  // ── Style ─────────────────────────────────────────────────────────────────
  updateNodeStyle: (id, style) =>
    set((state) => {
      const past = pushHistory(state.past, state.nodes);
      const nodes = state.nodes.map((n) =>
        n.id === id ? { ...n, style: { ...n.style, ...style } } : n,
      );
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: nodes };
      return { nodes, components: nodes, pageNodes, past, future: [] };
    }),

  // ── Props ─────────────────────────────────────────────────────────────────
  updateNodeProp: (id, key, value) =>
    set((state) => {
      const past = pushHistory(state.past, state.nodes);
      const nodes = state.nodes.map((n) =>
        n.id === id ? { ...n, props: { ...n.props, [key]: value } } : n,
      );
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: nodes };
      return { nodes, components: nodes, pageNodes, past, future: [] };
    }),

  // ── Undo / Redo ───────────────────────────────────────────────────────────
  undo: () =>
    set((state) => {
      if (!state.past.length) return {};
      const previous = state.past[state.past.length - 1];
      const past = state.past.slice(0, -1);
      const future = [state.nodes, ...state.future].slice(0, MAX_HISTORY);
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: previous };
      return { nodes: previous, components: previous, pageNodes, past, future };
    }),

  redo: () =>
    set((state) => {
      if (!state.future.length) return {};
      const next = state.future[0];
      const future = state.future.slice(1);
      const past = pushHistory(state.past, state.nodes);
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: next };
      return { nodes: next, components: next, pageNodes, past, future };
    }),

  // ── Pages ─────────────────────────────────────────────────────────────────
  addPage: (name) =>
    set((state) => {
      const id = uid();
      const slug = "/" + name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const newPage: PageData = { id, name, slug };
      // Save current nodes first
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: state.nodes, [id]: [] };
      return { pages: [...state.pages, newPage], pageNodes };
    }),

  deletePage: (id) =>
    set((state) => {
      if (state.pages.length <= 1) return {}; // always keep at least one page
      const newPages = state.pages.filter((p) => p.id !== id);
      const { [id]: _removed, ...newPageNodes } = state.pageNodes;

      let currentPageId = state.currentPageId;
      let nodes = state.nodes;
      if (currentPageId === id) {
        currentPageId = newPages[0].id;
        nodes = newPageNodes[currentPageId] ?? [];
      }
      return {
        pages: newPages,
        pageNodes: newPageNodes,
        currentPageId,
        nodes,
        components: nodes,
        selectedId: null,
        past: [],
        future: [],
      };
    }),

  renamePage: (id, name) =>
    set((state) => ({
      pages: state.pages.map((p) => (p.id === id ? { ...p, name } : p)),
    })),

  updatePageSlug: (id, slug) =>
    set((state) => ({
      pages: state.pages.map((p) => (p.id === id ? { ...p, slug } : p)),
    })),

  switchPage: (id) =>
    set((state) => {
      if (id === state.currentPageId) return {};
      // Save current page nodes
      const pageNodes = { ...state.pageNodes, [state.currentPageId]: state.nodes };
      const nodes = pageNodes[id] ?? [];
      return {
        pageNodes,
        currentPageId: id,
        nodes,
        components: nodes,
        selectedId: null,
        past: [],
        future: [],
      };
    }),
}));

// ── Global keyboard shortcuts ─────────────────────────────────────────────────
if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => {
    const store = useBuilderStore.getState();
    if (store.isPreviewMode) return;

    if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      store.undo();
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
      e.preventDefault();
      store.redo();
    }
    if (
      (e.key === "Delete" || e.key === "Backspace") &&
      store.selectedId &&
      !(e.target instanceof HTMLInputElement) &&
      !(e.target instanceof HTMLTextAreaElement) &&
      !(e.target as HTMLElement)?.isContentEditable
    ) {
      store.removeNode(store.selectedId);
    }
  });
}
