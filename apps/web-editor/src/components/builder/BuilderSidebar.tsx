// components/builder/BuilderSidebar.tsx
import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  Plus,
  Layers,
  FileText,
  ChevronRight,
  Trash2,
  Check,
  X,
  LayoutTemplate,
  Square,
  Box,
  Grid3X3,
  Columns2,
  Columns3,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  AlignLeft,
  Type,
  Link as LinkIcon,
  MousePointerClick,
  TextCursorInput,
  FileText as FileTextIcon,
  ChevronDown,
  Image,
  Video,
  Minus,
  PlusCircle,
} from "lucide-react";
import { ELEMENT_CATEGORIES } from "../../types/builder";
import { useBuilderStore } from "../../store/slices/useBuilderStore";

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
  TextCursorInput: <TextCursorInput className="w-4 h-4" />,
  FileText: <FileTextIcon className="w-4 h-4" />,
  ChevronDown: <ChevronDown className="w-4 h-4" />,
  Image: <Image className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
  Minus: <Minus className="w-4 h-4" />,
};

type Tab = "elements" | "pages" | "navigator";

export const BuilderSidebar = () => {
  const [tab, setTab] = useState<Tab>("elements");
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex border-b border-zinc-800 shrink-0">
        <TabBtn icon={<Plus className="w-3.5 h-3.5" />} label="Add" active={tab === "elements"} onClick={() => setTab("elements")} />
        <TabBtn icon={<FileText className="w-3.5 h-3.5" />} label="Pages" active={tab === "pages"} onClick={() => setTab("pages")} />
        <TabBtn icon={<Layers className="w-3.5 h-3.5" />} label="Layers" active={tab === "navigator"} onClick={() => setTab("navigator")} />
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
                ? cat.elements.filter(
                    (el) =>
                      el.label.toLowerCase().includes(search.toLowerCase()) ||
                      el.type.toLowerCase().includes(search.toLowerCase()),
                  )
                : cat.elements;
              if (!filtered.length) return null;
              return (
                <div key={cat.label}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-2 px-1">
                    {cat.label}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {filtered.map((el) => <DraggableElement key={el.type} def={el} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "pages" && <PagesPanel />}
      {tab === "navigator" && <NavigatorPanel />}
    </div>
  );
};

// ── Draggable element card ────────────────────────────────────────────────────

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
        isDragging
          ? "opacity-40 border-purple-500 bg-zinc-800"
          : "border-zinc-800 bg-zinc-900 hover:border-purple-500/60 hover:bg-zinc-800"
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

// ── Pages panel ───────────────────────────────────────────────────────────────

const PagesPanel = () => {
  const pages         = useBuilderStore((s) => s.pages);
  const currentPageId = useBuilderStore((s) => s.currentPageId);
  const addPage       = useBuilderStore((s) => s.addPage);
  const deletePage    = useBuilderStore((s) => s.deletePage);
  const renamePage    = useBuilderStore((s) => s.renamePage);
  const updatePageSlug = useBuilderStore((s) => s.updatePageSlug);
  const switchPage    = useBuilderStore((s) => s.switchPage);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName]   = useState("");
  const [editSlug, setEditSlug]   = useState("");
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName]     = useState("");

  const startEdit = (id: string, name: string, slug: string) => {
    setEditingId(id);
    setEditName(name);
    setEditSlug(slug);
  };

  const commitEdit = () => {
    if (editingId && editName.trim()) {
      renamePage(editingId, editName.trim());
      updatePageSlug(editingId, editSlug.trim() || `/${editName.trim().toLowerCase().replace(/\s+/g, "-")}`);
    }
    setEditingId(null);
  };

  const commitNew = () => {
    if (newName.trim()) addPage(newName.trim());
    setNewName("");
    setAddingNew(false);
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
              /* Inline edit form */
              <div className="p-2 space-y-1.5">
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                  placeholder="Page name"
                  className="w-full h-6 px-2 bg-zinc-800 border border-zinc-600 rounded text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                />
                <input
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                  placeholder="/slug"
                  className="w-full h-6 px-2 bg-zinc-800 border border-zinc-600 rounded text-xs text-zinc-400 font-mono focus:outline-none focus:border-purple-500"
                />
                <div className="flex gap-1">
                  <button onClick={commitEdit} className="flex-1 flex items-center justify-center gap-1 h-6 bg-purple-600 hover:bg-purple-500 text-white text-[10px] rounded">
                    <Check className="w-3 h-3" /> Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="flex items-center justify-center px-2 h-6 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-[10px] rounded">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              /* Normal row */
              <div
                className="flex items-center gap-2 p-2 cursor-pointer"
                onClick={() => switchPage(page.id)}
              >
                <FileText className={`w-3.5 h-3.5 shrink-0 ${page.id === currentPageId ? "text-purple-400" : "text-zinc-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${page.id === currentPageId ? "text-white" : "text-zinc-300"}`}>
                    {page.name}
                  </p>
                  <p className="text-[10px] font-mono text-zinc-600 truncate">{page.slug}</p>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); startEdit(page.id, page.name, page.slug); }}
                    className="p-1 hover:text-zinc-200 text-zinc-500 transition-colors"
                    title="Rename"
                  >
                    <Type className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deletePage(page.id); }}
                    className="p-1 hover:text-red-400 text-zinc-500 transition-colors"
                    title="Delete page"
                    disabled={pages.length <= 1}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add new page inline */}
        {addingNew && (
          <div className="p-2 rounded border border-zinc-700 bg-zinc-900 space-y-1.5">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") commitNew(); if (e.key === "Escape") setAddingNew(false); }}
              placeholder="Page name..."
              className="w-full h-6 px-2 bg-zinc-800 border border-zinc-600 rounded text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            />
            <div className="flex gap-1">
              <button onClick={commitNew} className="flex-1 flex items-center justify-center gap-1 h-6 bg-purple-600 hover:bg-purple-500 text-white text-[10px] rounded">
                <Check className="w-3 h-3" /> Add
              </button>
              <button onClick={() => setAddingNew(false)} className="flex items-center justify-center px-2 h-6 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-[10px] rounded">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add page button */}
      {!addingNew && (
        <div className="p-2 border-t border-zinc-800 shrink-0">
          <button
            onClick={() => setAddingNew(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded border border-dashed border-zinc-700 text-zinc-500 hover:border-purple-500/50 hover:text-purple-400 text-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Page
          </button>
        </div>
      )}
    </div>
  );
};

// ── Navigator panel ───────────────────────────────────────────────────────────

const NavigatorPanel = () => {
  const nodes = useBuilderStore((s) => s.nodes);
  const roots = nodes.filter((n) => n.parentId === null);

  if (!roots.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-600 text-xs font-mono p-4 text-center">
        No elements yet.
      </div>
    );
  }
  return (
    <div className="flex-1 overflow-y-auto p-2">
      {roots.map((n) => <NavigatorNode key={n.id} nodeId={n.id} depth={0} />)}
    </div>
  );
};

const NavigatorNode = ({ nodeId, depth }: { nodeId: string; depth: number }) => {
  const [open, setOpen] = useState(true);
  const nodes       = useBuilderStore((s) => s.nodes);
  const selectedId  = useBuilderStore((s) => s.selectedId);
  const selectNode  = useBuilderStore((s) => s.selectNode);
  const removeNode  = useBuilderStore((s) => s.removeNode);

  const node     = nodes.find((n) => n.id === nodeId);
  const children = nodes.filter((n) => n.parentId === nodeId);
  if (!node) return null;

  const label = node.props.text
    ? `${node.type}: "${node.props.text.slice(0, 16)}${node.props.text.length > 16 ? "…" : ""}"`
    : node.type;

  return (
    <div>
      <div
        style={{ paddingLeft: `${depth * 10 + 6}px` }}
        onClick={() => selectNode(node.id)}
        className={`flex items-center gap-1.5 py-1 pr-2 rounded cursor-pointer group text-xs transition-colors ${
          selectedId === node.id
            ? "bg-purple-600/20 text-purple-300"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
        }`}
      >
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
      {open && children.map((c) => <NavigatorNode key={c.id} nodeId={c.id} depth={depth + 1} />)}
    </div>
  );
};

// ── Tab button ────────────────────────────────────────────────────────────────

const TabBtn = ({
  icon, label, active, onClick,
}: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors border-b-2 ${
      active ? "text-white border-purple-500" : "text-zinc-500 border-transparent hover:text-zinc-300"
    }`}
  >
    {icon} {label}
  </button>
);
