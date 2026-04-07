// components/builder/BuilderSidebar.tsx
import { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import {
  Plus, Layers, FileText, Puzzle,
  ChevronRight, Trash2, Check, X, PlusCircle,
  LayoutTemplate, Square, Box, Grid3X3, Columns2, Columns3,
  Heading1, Heading2, Heading3, Heading4, AlignLeft, Type,
  Link as LinkIcon, MousePointerClick, TextCursorInput,
  FileText as FileTextIcon, ChevronDown, Image, Video, Minus,
  GripVertical, Bookmark, Star, Code2, ToggleLeft, ToggleRight, Wallet,
} from "lucide-react";
import { ContractsPanel } from "./ContractsPanel";
import { ELEMENT_CATEGORIES } from "../../types/builder";
import { useBuilderStore } from "../../store/slices/useBuilderStore";
import { COMPONENT_TEMPLATES, COMPONENT_CATEGORIES } from "./prebuilt-components";

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutTemplate: <LayoutTemplate className="w-4 h-4" />,
  Square: <Square className="w-4 h-4" />,
  Box: <Box className="w-4 h-4" />,
  Grid3x3: <Grid3X3 className="w-4 h-4" />,
  Columns2: <Columns2 className="w-4 h-4" />,
  Columns3: <Columns3 className="w-4 h-4" />,
  Heading1: <Heading1 className="w-4 h-4" />,
  Heading2: <Heading2 className="w-4 h-4" />,
  Heading3: <Heading3 className="w-4 h-4" />,
  Heading4: <Heading4 className="w-4 h-4" />,
  AlignLeft: <AlignLeft className="w-4 h-4" />,
  Type: <Type className="w-4 h-4" />,
  Link: <LinkIcon className="w-4 h-4" />,
  MousePointerClick: <MousePointerClick className="w-4 h-4" />,
  Wallet: <Wallet className="w-4 h-4" />,
  TextCursorInput: <TextCursorInput className="w-4 h-4" />,
  FileText: <FileTextIcon className="w-4 h-4" />,
  ChevronDown: <ChevronDown className="w-4 h-4" />,
  Image: <Image className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
  Minus: <Minus className="w-4 h-4" />,
};

type Tab = "elements" | "components" | "pages" | "contracts" | "navigator";

export const BuilderSidebar = () => {
  const [tab, setTab] = useState<Tab>("elements");
  const [search, setSearch] = useState("");
  const contracts = useBuilderStore((s) => s.contracts);

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex border-b border-zinc-800 shrink-0 overflow-x-auto">
        <TabBtn icon={<Plus className="w-3 h-3" />} label="Add" active={tab === "elements"} onClick={() => setTab("elements")} />
        <TabBtn icon={<Puzzle className="w-3 h-3" />} label="Comp" active={tab === "components"} onClick={() => setTab("components")} />
        <TabBtn icon={<FileText className="w-3 h-3" />} label="Pages" active={tab === "pages"} onClick={() => setTab("pages")} />
        <TabBtn
          icon={<Code2 className="w-3 h-3" />}
          label="Web3"
          active={tab === "contracts"}
          onClick={() => setTab("contracts")}
          badge={contracts.length > 0 ? contracts.length : undefined}
        />
        <TabBtn icon={<Layers className="w-3 h-3" />} label="Layers" active={tab === "navigator"} onClick={() => setTab("navigator")} />
      </div>

      {tab === "elements" && (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="p-2 border-b border-zinc-800 shrink-0">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search elements..."
              className="w-full h-7 px-2.5 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {ELEMENT_CATEGORIES.map((cat) => {
              const filtered = search
                ? cat.elements.filter((el) =>
                    el.label.toLowerCase().includes(search.toLowerCase()) ||
                    el.type.toLowerCase().includes(search.toLowerCase()),
                  )
                : cat.elements;
              if (!filtered.length) return null;
              return (
                <div key={cat.label}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-2 px-1">{cat.label}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {filtered.map((el) => <DraggableElement key={el.type} def={el} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "components" && <ComponentsPanel />}
      {tab === "pages" && <PagesPanel />}
      {tab === "contracts" && (
        <div className="flex-1 overflow-y-auto">
          <ContractsPanel />
        </div>
      )}
      {tab === "navigator" && <NavigatorPanel />}
    </div>
  );
};

// ── Draggable element (palette) ───────────────────────────────────────────────

const DraggableElement = ({
  def,
}: {
  def: { type: string; label: string; icon: string; description: string };
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${def.type}`,
    data: { type: def.type, label: def.label, isSidebarItem: true },
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      title={def.description}
      className={`flex flex-col items-center gap-1.5 p-2.5 rounded border cursor-grab active:cursor-grabbing transition-all group ${
        isDragging ? "opacity-40 border-purple-500 bg-zinc-800" : "border-zinc-800 bg-zinc-900 hover:border-purple-500/60 hover:bg-zinc-800"
      }`}
    >
      <div className="text-zinc-500 group-hover:text-purple-400 transition-colors">
        {ICON_MAP[def.icon] ?? <Box className="w-4 h-4" />}
      </div>
      <span className="text-[10px] text-zinc-400 group-hover:text-zinc-200 text-center leading-tight transition-colors font-medium">
        {def.label}
      </span>
    </div>
  );
};

// ── Components panel ──────────────────────────────────────────────────────────

const ComponentsPanel = () => {
  const customComponents   = useBuilderStore((s) => s.customComponents);
  const deleteCustomComponent = useBuilderStore((s) => s.deleteCustomComponent);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = COMPONENT_TEMPLATES.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = activeCategory === "All" || t.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="p-2 space-y-2 border-b border-zinc-800 shrink-0">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search components..."
          className="w-full h-7 px-2.5 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-purple-500"
        />
        <div className="flex gap-1 flex-wrap">
          {["All", ...COMPONENT_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2 h-5 rounded text-[10px] font-medium transition-colors ${
                activeCategory === cat ? "bg-purple-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* Library */}
        {filtered.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-2 px-1">Library</p>
            <div className="space-y-1.5">
              {filtered.map((tpl) => (
                <DraggableComponentCard
                  key={tpl.id}
                  id={`component-tpl-${tpl.id}`}
                  label={tpl.name}
                  category={tpl.category}
                  data={{ isComponentTemplate: true, templateId: tpl.id, label: tpl.name }}
                  icon={<LayoutTemplate className="w-3.5 h-3.5" />}
                />
              ))}
            </div>
          </div>
        )}

        {/* My Components */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-2 px-1">
            My Components {customComponents.length > 0 && <span className="text-purple-500">({customComponents.length})</span>}
          </p>
          {customComponents.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <Bookmark className="w-6 h-6 text-zinc-700" />
              <p className="text-[11px] text-zinc-600">
                Select an element and click<br />"Save as Component" to reuse it.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {customComponents.map((comp) => (
                <div key={comp.id} className="flex items-center gap-1 group">
                  <DraggableComponentCard
                    id={`custom-comp-${comp.id}`}
                    label={comp.name}
                    category="My Components"
                    data={{ isCustomComponent: true, componentId: comp.id, label: comp.name }}
                    icon={<Star className="w-3.5 h-3.5" />}
                    className="flex-1"
                  />
                  <button
                    onClick={() => deleteCustomComponent(comp.id)}
                    className="p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DraggableComponentCard = ({
  id, label, category, data, icon, className = "",
}: {
  id: string; label: string; category: string; data: any; icon: React.ReactNode; className?: string;
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, data });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 p-2 rounded border cursor-grab active:cursor-grabbing transition-all group ${
        isDragging ? "opacity-40 border-purple-500 bg-zinc-800" : "border-zinc-800 bg-zinc-900 hover:border-purple-500/40 hover:bg-zinc-800"
      } ${className}`}
    >
      <div className="text-zinc-500 group-hover:text-purple-400 transition-colors shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-zinc-300 group-hover:text-zinc-100 truncate">{label}</p>
        <p className="text-[9px] text-zinc-600 truncate">{category}</p>
      </div>
      <GripVertical className="w-3 h-3 text-zinc-700 shrink-0" />
    </div>
  );
};

// ── Pages panel ───────────────────────────────────────────────────────────────

const PagesPanel = () => {
  const pages           = useBuilderStore((s) => s.pages);
  const currentPageId   = useBuilderStore((s) => s.currentPageId);
  const addPage         = useBuilderStore((s) => s.addPage);
  const deletePage      = useBuilderStore((s) => s.deletePage);
  const renamePage      = useBuilderStore((s) => s.renamePage);
  const updatePageSlug  = useBuilderStore((s) => s.updatePageSlug);
  const setPageDynamic  = useBuilderStore((s) => s.setPageDynamic);
  const switchPage      = useBuilderStore((s) => s.switchPage);

  const [editingId, setEditingId]         = useState<string | null>(null);
  const [editName, setEditName]           = useState("");
  const [editSlug, setEditSlug]           = useState("");
  const [editDynamic, setEditDynamic]     = useState(false);
  const [editParam, setEditParam]         = useState("id");
  const [addingNew, setAddingNew]         = useState(false);
  const [newName, setNewName]             = useState("");

  const commitEdit = () => {
    if (editingId && editName.trim()) {
      renamePage(editingId, editName.trim());
      const slug = editDynamic
        ? `/${editName.trim().toLowerCase().replace(/\s+/g, "-")}/:${editParam.trim() || "id"}`
        : editSlug.trim() || `/${editName.trim().toLowerCase().replace(/\s+/g, "-")}`;
      updatePageSlug(editingId, slug);
      setPageDynamic(editingId, editDynamic, editParam.trim() || "id");
    }
    setEditingId(null);
  };

  const startEdit = (page: (typeof pages)[number]) => {
    setEditingId(page.id);
    setEditName(page.name);
    setEditSlug(page.slug);
    setEditDynamic(page.isDynamic ?? false);
    setEditParam(page.dynamicParam ?? "id");
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`group rounded border transition-colors ${
              page.id === currentPageId
                ? "border-purple-600/50 bg-purple-600/10"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            }`}
          >
            {editingId === page.id ? (
              <div className="p-2 space-y-1.5">
                <input autoFocus value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && commitEdit()} placeholder="Page name" className="w-full h-6 px-2 bg-zinc-800 border border-zinc-600 rounded text-xs text-zinc-200 focus:outline-none focus:border-purple-500" />
                {!editDynamic && (
                  <input value={editSlug} onChange={(e) => setEditSlug(e.target.value)} onKeyDown={(e) => e.key === "Enter" && commitEdit()} placeholder="/slug" className="w-full h-6 px-2 bg-zinc-800 border border-zinc-600 rounded text-xs text-zinc-400 font-mono focus:outline-none focus:border-purple-500" />
                )}
                {/* Dynamic route toggle */}
                <div className="flex items-center justify-between px-1 py-0.5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 font-medium">Dynamic Route</span>
                    <span className="text-[9px] text-zinc-600">e.g. /nft/:id</span>
                  </div>
                  <button
                    onClick={() => setEditDynamic((v) => !v)}
                    className={`transition-colors ${editDynamic ? "text-purple-400" : "text-zinc-600"}`}
                  >
                    {editDynamic ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                </div>
                {editDynamic && (
                  <div className="flex items-center gap-1">
                    <span className="text-zinc-600 text-[10px] font-mono">/:param</span>
                    <input
                      value={editParam}
                      onChange={(e) => setEditParam(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                      placeholder="id"
                      className="flex-1 h-6 px-2 bg-zinc-800 border border-zinc-600 rounded text-xs text-violet-300 font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}
                <div className="flex gap-1">
                  <button onClick={commitEdit} className="flex-1 flex items-center justify-center gap-1 h-6 bg-purple-600 hover:bg-purple-500 text-white text-[10px] rounded"><Check className="w-3 h-3" /> Save</button>
                  <button onClick={() => setEditingId(null)} className="flex items-center justify-center px-2 h-6 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-[10px] rounded"><X className="w-3 h-3" /></button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 cursor-pointer" onClick={() => switchPage(page.id)}>
                <FileText className={`w-3.5 h-3.5 shrink-0 ${page.id === currentPageId ? "text-purple-400" : "text-zinc-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={`text-xs font-medium truncate ${page.id === currentPageId ? "text-white" : "text-zinc-300"}`}>{page.name}</p>
                    {page.isDynamic && (
                      <span className="text-[8px] px-1 rounded bg-violet-900/50 text-violet-400 border border-violet-800/50 shrink-0">dynamic</span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-zinc-600 truncate">{page.slug}</p>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                  <button onClick={(e) => { e.stopPropagation(); startEdit(page); }} className="p-1 hover:text-zinc-200 text-zinc-500"><Type className="w-3 h-3" /></button>
                  <button onClick={(e) => { e.stopPropagation(); deletePage(page.id); }} className="p-1 hover:text-red-400 text-zinc-500" disabled={pages.length <= 1}><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            )}
          </div>
        ))}

        {addingNew && (
          <div className="p-2 rounded border border-zinc-700 bg-zinc-900 space-y-1.5">
            <input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { addPage(newName.trim()); setNewName(""); setAddingNew(false); } if (e.key === "Escape") setAddingNew(false); }} placeholder="Page name..." className="w-full h-6 px-2 bg-zinc-800 border border-zinc-600 rounded text-xs text-zinc-200 focus:outline-none focus:border-purple-500" />
            <div className="flex gap-1">
              <button onClick={() => { addPage(newName.trim()); setNewName(""); setAddingNew(false); }} className="flex-1 flex items-center justify-center gap-1 h-6 bg-purple-600 hover:bg-purple-500 text-white text-[10px] rounded"><Check className="w-3 h-3" /> Add</button>
              <button onClick={() => setAddingNew(false)} className="flex items-center justify-center px-2 h-6 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-[10px] rounded"><X className="w-3 h-3" /></button>
            </div>
          </div>
        )}
      </div>

      {!addingNew && (
        <div className="p-2 border-t border-zinc-800 shrink-0">
          <button onClick={() => setAddingNew(true)} className="w-full flex items-center justify-center gap-1.5 py-2 rounded border border-dashed border-zinc-700 text-zinc-500 hover:border-purple-500/50 hover:text-purple-400 text-xs transition-colors">
            <PlusCircle className="w-3.5 h-3.5" /> New Page
          </button>
        </div>
      )}
    </div>
  );
};

// ── Navigator (Layers) with DnD ───────────────────────────────────────────────

const NavigatorPanel = () => {
  const nodes = useBuilderStore((s) => s.nodes);
  const roots = nodes.filter((n) => n.parentId === null);
  if (!roots.length) {
    return <div className="flex-1 flex items-center justify-center text-zinc-600 text-xs font-mono p-4 text-center">No elements yet.</div>;
  }
  return (
    <div className="flex-1 overflow-y-auto p-1.5">
      {/* Canvas root is a drop target for reparenting to top level */}
      <CanvasRootDropZone />
      {roots.map((n) => <LayerNode key={n.id} nodeId={n.id} depth={0} />)}
    </div>
  );
};

/** Invisible droppable zone at top of navigator (drop here = no parent / top level) */
const CanvasRootDropZone = () => {
  const { setNodeRef, isOver } = useDroppable({
    id: "layer-root-drop",
    data: { isContainer: true, id: null },
  });
  return (
    <div
      ref={setNodeRef}
      className={`h-1 mb-0.5 rounded transition-colors ${isOver ? "bg-purple-500" : "bg-transparent"}`}
    />
  );
};

/** A single row in the layers tree — draggable + droppable */
const LayerNode = ({ nodeId, depth }: { nodeId: string; depth: number }) => {
  const [open, setOpen]       = useState(true);
  const nodes      = useBuilderStore((s) => s.nodes);
  const selectedId = useBuilderStore((s) => s.selectedId);
  const selectNode = useBuilderStore((s) => s.selectNode);
  const removeNode = useBuilderStore((s) => s.removeNode);

  const node     = nodes.find((n) => n.id === nodeId);
  const children = nodes.filter((n) => n.parentId === nodeId);
  if (!node) return null;

  const label = node.props.text
    ? `${node.type}: "${node.props.text.slice(0, 14)}${node.props.text.length > 14 ? "…" : ""}"`
    : node.type;

  // Draggable — same data shape as canvas nodes (isLayerNode flag added)
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: `layer-node-${nodeId}`,
    data: { isLayerNode: true, isCanvasNode: true, nodeId },
  });

  // Droppable — can receive other nodes (reparent)
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `layer-drop-${nodeId}`,
    data: { isContainer: true, id: nodeId },
  });

  const setCombined = (el: HTMLElement | null) => {
    setDragRef(el);
    setDropRef(el);
  };

  return (
    <div style={{ opacity: isDragging ? 0.3 : 1 }}>
      <div
        ref={setCombined}
        style={{ paddingLeft: `${depth * 10 + 4}px` }}
        onClick={() => selectNode(node.id)}
        className={`flex items-center gap-1.5 py-1 pr-2 rounded cursor-pointer group text-xs transition-colors ${
          selectedId === node.id ? "bg-purple-600/20 text-purple-300" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
        } ${isOver ? "bg-purple-900/30 outline outline-1 outline-purple-500" : ""}`}
      >
        {/* Drag handle */}
        <div
          {...listeners}
          {...attributes}
          onClick={(e) => e.stopPropagation()}
          className="p-0.5 cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400"
        >
          <GripVertical className="w-3 h-3" />
        </div>

        {/* Expand toggle */}
        {children.length > 0 ? (
          <button onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }} className="shrink-0">
            <ChevronRight className={`w-3 h-3 transition-transform ${open ? "rotate-90" : ""}`} />
          </button>
        ) : (
          <span className="w-3 shrink-0" />
        )}

        <span className="flex-1 truncate">{label}</span>

        <button
          onClick={(e) => { e.stopPropagation(); removeNode(node.id); }}
          className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 transition-all shrink-0"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {open && children.map((c) => (
        <LayerNode key={c.id} nodeId={c.id} depth={depth + 1} />
      ))}
    </div>
  );
};

// ── Tab button ────────────────────────────────────────────────────────────────

const TabBtn = ({ icon, label, active, onClick, badge }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void; badge?: number;
}) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors border-b-2 relative ${
      active ? "text-white border-purple-500" : "text-zinc-500 border-transparent hover:text-zinc-300"
    }`}
  >
    {icon} {label}
    {badge !== undefined && (
      <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-violet-600 text-white text-[8px] flex items-center justify-center font-bold">
        {badge > 9 ? "9+" : badge}
      </span>
    )}
  </button>
);
