// components/builder/CanvasNode.tsx
import React, { useState, useRef } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { Copy, Trash2, ChevronUp, GripVertical } from "lucide-react";
import { useBuilderStore } from "../../store/slices/useBuilderStore";
import { CONTAINER_TYPES, type StyleProps } from "../../types/builder";

// ── HTML tag map ──────────────────────────────────────────────────────────────

const TAG_MAP: Record<string, keyof React.JSX.IntrinsicElements> = {
  Section: "section",
  Container: "div",
  Div: "div",
  Grid: "div",
  Columns2: "div",
  Columns3: "div",
  Column: "div",
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  H5: "h5",
  H6: "h6",
  Paragraph: "p",
  Text: "span",
  Link: "a",
  Button: "button",
  Input: "input",
  Textarea: "textarea",
  Select: "select",
  Image: "img",
  Video: "video",
  Divider: "hr",
};

const TEXT_TYPES = new Set([
  "H1","H2","H3","H4","H5","H6","Paragraph","Text","Link","Button",
]);

const cleanStyle = (style: StyleProps): React.CSSProperties => {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(style)) {
    if (v !== undefined && v !== "") out[k] = v;
  }
  return out as React.CSSProperties;
};

// ── CanvasNode ────────────────────────────────────────────────────────────────

export const CanvasNode = ({ nodeId }: { nodeId: string }) => {
  const nodes       = useBuilderStore((s) => s.nodes);
  const selectedId  = useBuilderStore((s) => s.selectedId);
  const hoveredId   = useBuilderStore((s) => s.hoveredId);
  const pages       = useBuilderStore((s) => s.pages);
  const isPreview   = useBuilderStore((s) => s.isPreviewMode);
  const selectNode  = useBuilderStore((s) => s.selectNode);
  const hoverNode   = useBuilderStore((s) => s.hoverNode);
  const removeNode  = useBuilderStore((s) => s.removeNode);
  const duplicateNode = useBuilderStore((s) => s.duplicateNode);
  const updateNodeProp = useBuilderStore((s) => s.updateNodeProp);
  const switchPage  = useBuilderStore((s) => s.switchPage);

  const [isEditing, setIsEditing] = useState(false);
  const editRef = useRef<HTMLElement>(null);

  const node     = nodes.find((n) => n.id === nodeId);
  const children = nodes.filter((n) => n.parentId === nodeId);

  const isContainer = node ? CONTAINER_TYPES.has(node.type) : false;

  // Droppable (containers only, disabled in preview)
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `node-${nodeId}`,
    data: { isContainer, id: nodeId },
    disabled: !isContainer || isPreview,
  });

  // Draggable (for moving within canvas, disabled in preview)
  const {
    attributes: dragAttrs,
    listeners: dragListeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: `canvas-node-${nodeId}`,
    data: { isCanvasNode: true, nodeId },
    disabled: isPreview,
  });

  if (!node) return null;

  const Tag         = TAG_MAP[node.type] ?? "div";
  const isSelected  = selectedId === nodeId;
  const isHovered   = hoveredId === nodeId && !isSelected;
  const isTextNode  = TEXT_TYPES.has(node.type);
  const showLabel   = (isSelected || isHovered) && !isPreview;

  // ── Click handlers ────────────────────────────────────────────────────────

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPreview) {
      // In preview mode: navigate to linked page if set
      if (node.props.pageId) {
        switchPage(node.props.pageId);
      } else if (node.props.href && node.props.href !== "#") {
        window.open(node.props.href, node.props.target ?? "_self");
      }
      return;
    }
    selectNode(nodeId);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isTextNode || isPreview) return;
    e.stopPropagation();
    setIsEditing(true);
    setTimeout(() => editRef.current?.focus(), 0);
  };

  const handleBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      updateNodeProp(nodeId, "text", editRef.current?.innerText ?? "");
    }
  };

  const handleSelectParent = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(node.parentId ?? null);
  };

  // ── Outline styling ───────────────────────────────────────────────────────

  const outlineStyle: React.CSSProperties = isPreview
    ? {}
    : isDragging
      ? { opacity: 0.3 }
      : isSelected
        ? { outline: "2px solid #a855f7", outlineOffset: "1px" }
        : isHovered
          ? { outline: "1px solid #818cf8", outlineOffset: "1px" }
          : isOver
            ? { outline: "2px dashed #a855f7", outlineOffset: "1px" }
            : {};

  const nodeStyle = cleanStyle(node.style);

  // ── Leaf media/form elements ──────────────────────────────────────────────

  if (["Image","Divider","Input","Textarea","Select","Video"].includes(node.type)) {
    return (
      <div
        ref={setDragRef as any}
        onClick={handleClick}
        onMouseEnter={(e) => { e.stopPropagation(); if (!isPreview) hoverNode(nodeId); }}
        onMouseLeave={() => hoverNode(null)}
        style={{ position: "relative", ...outlineStyle }}
      >
        {showLabel && (
          <NodeLabel
            node={node}
            dragListeners={dragListeners}
            dragAttrs={dragAttrs}
            onParent={handleSelectParent}
            onDuplicate={() => duplicateNode(nodeId)}
            onDelete={() => removeNode(nodeId)}
          />
        )}
        {node.type === "Image" && <img src={node.props.src} alt={node.props.alt ?? ""} style={nodeStyle} draggable={false} />}
        {node.type === "Divider" && <hr style={nodeStyle} />}
        {node.type === "Input" && <input placeholder={node.props.placeholder} style={nodeStyle} readOnly={!isPreview} />}
        {node.type === "Textarea" && <textarea placeholder={node.props.placeholder} style={nodeStyle} readOnly={!isPreview} />}
        {node.type === "Select" && <select style={nodeStyle} disabled={!isPreview}><option>{node.props.placeholder ?? "Select..."}</option></select>}
        {node.type === "Video" && <video src={node.props.src} style={nodeStyle} controls />}
      </div>
    );
  }

  // ── Container ─────────────────────────────────────────────────────────────

  if (isContainer) {
    return (
      <Tag
        ref={(el: any) => { setDropRef(el); }}
        style={{ ...nodeStyle, position: "relative", ...outlineStyle }}
        onClick={handleClick}
        onMouseEnter={(e: React.MouseEvent) => { e.stopPropagation(); if (!isPreview) hoverNode(nodeId); }}
        onMouseLeave={() => hoverNode(null)}
      >
        {showLabel && (
          <NodeLabel
            node={node}
            dragListeners={dragListeners}
            dragAttrs={dragAttrs}
            onParent={handleSelectParent}
            onDuplicate={() => duplicateNode(nodeId)}
            onDelete={() => removeNode(nodeId)}
          />
        )}

        {children.map((c) => <CanvasNode key={c.id} nodeId={c.id} />)}

        {children.length === 0 && !isPreview && (
          <div
            className={`flex items-center justify-center min-h-[60px] border border-dashed text-xs font-mono transition-colors ${
              isOver
                ? "border-purple-400 bg-purple-50 text-purple-500"
                : "border-zinc-300 text-zinc-400"
            }`}
          >
            {isOver ? "Drop here" : `Empty ${node.type}`}
          </div>
        )}
      </Tag>
    );
  }

  // ── Text / interactive node ───────────────────────────────────────────────

  const editableProps = isEditing && isTextNode
    ? { contentEditable: true as const, suppressContentEditableWarning: true }
    : {};

  const linkProps = node.type === "Link"
    ? {
        href: isPreview ? (node.props.href ?? "#") : undefined,
        target: node.props.target,
        onClick: isPreview
          ? (e: React.MouseEvent) => {
              e.stopPropagation();
              if (node.props.pageId) { switchPage(node.props.pageId); e.preventDefault(); }
            }
          : (e: React.MouseEvent) => e.preventDefault(),
      }
    : {};

  return (
    <Tag
      ref={editRef as any}
      style={{ ...nodeStyle, ...outlineStyle }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onMouseEnter={(e: React.MouseEvent) => { e.stopPropagation(); if (!isPreview) hoverNode(nodeId); }}
      onMouseLeave={() => hoverNode(null)}
      {...editableProps}
      {...linkProps}
    >
      {showLabel && !isEditing && (
        <NodeLabel
          node={node}
          dragListeners={dragListeners}
          dragAttrs={dragAttrs}
          onParent={handleSelectParent}
          onDuplicate={() => duplicateNode(nodeId)}
          onDelete={() => removeNode(nodeId)}
        />
      )}
      {!isEditing && (node.props.text ?? "")}
    </Tag>
  );
};

// ── Node toolbar ──────────────────────────────────────────────────────────────

const NodeLabel = ({
  node,
  dragListeners,
  dragAttrs,
  onParent,
  onDuplicate,
  onDelete,
}: {
  node: any;
  dragListeners: any;
  dragAttrs: any;
  onParent: (e: React.MouseEvent) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) => (
  <div
    contentEditable={false}
    className="absolute top-0 left-0 z-50 flex items-center gap-0.5 pointer-events-auto"
    style={{ transform: "translateY(-100%)" }}
    onClick={(e) => e.stopPropagation()}
  >
    {/* Drag handle */}
    <div
      {...dragListeners}
      {...dragAttrs}
      title="Drag to move"
      className="p-0.5 bg-zinc-800 hover:bg-zinc-600 text-zinc-400 hover:text-zinc-200 rounded-sm cursor-grab active:cursor-grabbing"
    >
      <GripVertical className="w-2.5 h-2.5" />
    </div>

    <span className="px-1.5 py-0.5 bg-purple-600 text-white text-[9px] font-bold uppercase tracking-wider rounded-sm select-none">
      {node.type}
    </span>

    <button onClick={onParent} title="Select parent" className="p-0.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-sm">
      <ChevronUp className="w-2.5 h-2.5" />
    </button>
    <button onClick={onDuplicate} title="Duplicate" className="p-0.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-sm">
      <Copy className="w-2.5 h-2.5" />
    </button>
    <button onClick={onDelete} title="Delete" className="p-0.5 bg-zinc-700 hover:bg-red-600 text-zinc-300 rounded-sm">
      <Trash2 className="w-2.5 h-2.5" />
    </button>
  </div>
);
