// components/builder/CanvasNode.tsx
import React, { useState, useRef, useCallback } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { Copy, Trash2, ChevronUp, GripVertical } from "lucide-react";
import { useBuilderStore } from "../../store/slices/useBuilderStore";
import { CONTAINER_TYPES, type StyleProps } from "../../types/builder";
import { useAccount, useConnect, useWriteContract } from "wagmi";
import { parseEther } from "viem";

// ── Tag map ───────────────────────────────────────────────────────────────────

const TAG_MAP: Record<string, keyof React.JSX.IntrinsicElements> = {
  Section: "section", Container: "div", Div: "div",
  Grid: "div", Columns2: "div", Columns3: "div", Column: "div",
  H1: "h1", H2: "h2", H3: "h3", H4: "h4", H5: "h5", H6: "h6",
  Paragraph: "p", Text: "span", Link: "a", Button: "button",
  ConnectWalletButton: "button",
  Input: "input", Textarea: "textarea", Select: "select",
  Image: "img", Video: "video", Divider: "hr",
};

const TEXT_TYPES = new Set(["H1","H2","H3","H4","H5","H6","Paragraph","Text","Link","Button","ConnectWalletButton"]);

const cleanStyle = (style: StyleProps): React.CSSProperties => {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(style)) {
    if (v !== undefined && v !== "") out[k] = v;
  }
  return out as React.CSSProperties;
};

// ── InsertZone — thin droppable gap between siblings ──────────────────────────

export const InsertZone = ({
  parentId,
  insertBefore,
  horizontal = false,
}: {
  parentId: string;
  insertBefore: string | null;
  horizontal?: boolean;
}) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id: `insert-${parentId}-${insertBefore ?? "end"}`,
    data: { isInsertZone: true, parentId, insertBefore },
  });
  if (!active) return <div className={horizontal ? "w-1" : "h-1"} />;
  return (
    <div
      ref={setNodeRef}
      className={`transition-all rounded-full ${horizontal ? "w-2 self-stretch" : "h-2 w-full"} ${
        isOver ? (horizontal ? "bg-purple-500 w-1.5" : "bg-purple-500 h-1.5") : "bg-purple-300/30"
      }`}
    />
  );
};

// ── CanvasNode ────────────────────────────────────────────────────────────────

export const CanvasNode = ({ nodeId }: { nodeId: string }) => {
  const nodes         = useBuilderStore((s) => s.nodes);
  const contracts     = useBuilderStore((s) => s.contracts);
  const selectedId    = useBuilderStore((s) => s.selectedId);
  const hoveredId     = useBuilderStore((s) => s.hoveredId);
  const isPreview     = useBuilderStore((s) => s.isPreviewMode);
  const selectNode    = useBuilderStore((s) => s.selectNode);
  const hoverNode     = useBuilderStore((s) => s.hoverNode);
  const removeNode    = useBuilderStore((s) => s.removeNode);
  const duplicateNode = useBuilderStore((s) => s.duplicateNode);
  const updateNodeProp = useBuilderStore((s) => s.updateNodeProp);
  const switchPage    = useBuilderStore((s) => s.switchPage);

  // ── Real wallet + contract hooks (only active in preview mode) ────────────
  const { isConnected, address: walletAddress } = useAccount();
  const { connect, connectors } = useConnect();
  const { writeContract, isPending: contractPending } = useWriteContract();

  const [isEditing, setIsEditing] = useState(false);
  const editRef = useRef<HTMLElement>(null);

  const node     = nodes.find((n) => n.id === nodeId);
  const children = nodes.filter((n) => n.parentId === nodeId);
  const isContainer = node ? CONTAINER_TYPES.has(node.type) : false;

  // ── Droppable (containers only) ───────────────────────────────────────────
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `node-${nodeId}`,
    data: { isContainer, id: nodeId },
    disabled: !isContainer || isPreview,
  });

  // ── Draggable — apply to the ENTIRE node surface ───────────────────────────
  // setNodeRef tells dnd-kit the bounding box. listeners go on the label bar
  // (the activator), so clicking the canvas body still selects without dragging.
  const {
    attributes: dragAttrs,
    listeners: dragListeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: `canvas-node-${nodeId}`,
    data: { isCanvasNode: true, nodeId },
    disabled: isPreview || isEditing,
  });

  // Combine refs for containers (both droppable and draggable)
  const setCombinedRef = useCallback(
    (el: Element | null) => {
      setDragRef(el as HTMLElement | null);
      if (isContainer) setDropRef(el as HTMLElement | null);
    },
    [setDragRef, setDropRef, isContainer],
  );

  if (!node) return null;

  // Apply data binding resolution in preview
  const effectiveProps = isPreview ? resolveBindings(node.props) : node.props;

  const Tag: any   = TAG_MAP[node.type] ?? "div";
  const isSelected = selectedId === nodeId;
  const isHovered  = hoveredId === nodeId && !isSelected;
  const isTextNode = TEXT_TYPES.has(node.type);
  // Show toolbar on hover OR select (never in preview)
  const showLabel  = (isSelected || isHovered) && !isPreview && !isDragging;

  // Detect if the parent is a flex-row container (for horizontal insert zones)
  const parent = nodes.find((n) => n.id === node.parentId);
  const parentIsRow = parent && (parent.style.flexDirection === "row" || parent.style.display === "grid");

  // ── Resolve data bindings for preview display ────────────────────────────
  function resolveBindings(rawProps: Record<string, any>) {
    if (!node?.dataBindings?.length) return rawProps;
    const resolved = { ...rawProps };
    for (const binding of node.dataBindings) {
      if (binding.source.kind === "walletAddress") {
        resolved[binding.propKey] = walletAddress
          ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
          : "Not connected";
      }
      // contractRead and dynamicParam bindings would be resolved at runtime by the live site
    }
    return resolved;
  }

  // ── Event handlers ────────────────────────────────────────────────────────
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPreview) {
      // 1. Connect wallet button
      if (node.props.isConnectWallet) {
        if (isConnected) return; // already connected
        const connector = connectors[0];
        if (connector) connect({ connector });
        return;
      }

      // 2. Contract action (write call)
      if (node.contractAction) {
        const contract = contracts.find((c) => c.id === node.contractAction!.contractId);
        if (contract && contract.address && contract.address.startsWith("0x")) {
          const action = node.contractAction;
          writeContract({
            address: contract.address as `0x${string}`,
            abi: contract.abi as any,
            functionName: action.functionName,
            args: action.args ?? [],
            ...(action.value ? { value: BigInt(action.value) } : {}),
          });
        }
        return;
      }

      // 3. Page navigation
      if (node.props.pageId) { switchPage(node.props.pageId); return; }

      // 4. External link
      if (node.props.href && node.props.href !== "#") {
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
    setTimeout(() => { editRef.current?.focus(); selectAllText(editRef.current); }, 0);
  };

  const handleBlur = () => {
    if (!isEditing) return;
    setIsEditing(false);
    updateNodeProp(nodeId, "text", editRef.current?.innerText ?? "");
  };

  const handleSelectParent = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(node.parentId ?? null);
  };

  // ── Outline ───────────────────────────────────────────────────────────────
  const outline: React.CSSProperties = isPreview ? {} : isDragging
    ? { opacity: 0.25, pointerEvents: "none" }
    : isSelected
      ? { outline: "2px solid #a855f7", outlineOffset: "1px" }
      : isHovered
        ? { outline: "1px solid #818cf8", outlineOffset: "1px" }
        : isOver
          ? { outline: "2px dashed #a855f7", outlineOffset: "1px" }
          : {};

  const nodeStyle: React.CSSProperties = { ...cleanStyle(node.style), ...outline, position: "relative" };

  // ── Shared label ──────────────────────────────────────────────────────────
  const labelEl = showLabel ? (
    <NodeLabel
      node={node}
      dragListeners={dragListeners}
      dragAttrs={dragAttrs}
      onParent={handleSelectParent}
      onDuplicate={() => duplicateNode(nodeId)}
      onDelete={() => removeNode(nodeId)}
    />
  ) : null;

  // ── Detect parent flex direction for InsertZone orientation ──────────────
  const isHRow = parentIsRow;

  // ── Leaf media / form elements ────────────────────────────────────────────
  if (["Image","Divider","Input","Textarea","Select","Video"].includes(node.type)) {
    return (
      <div
        ref={setCombinedRef as any}
        onClick={handleClick}
        onMouseEnter={(e) => { e.stopPropagation(); if (!isPreview) hoverNode(nodeId); }}
        onMouseLeave={() => hoverNode(null)}
        style={{ position: "relative", ...outline, display: "contents" }}
      >
        {labelEl}
        {node.type === "Image" && <img src={node.props.src} alt={node.props.alt ?? ""} style={cleanStyle(node.style)} draggable={false} />}
        {node.type === "Divider" && <hr style={cleanStyle(node.style)} />}
        {node.type === "Input" && <input placeholder={node.props.placeholder} style={cleanStyle(node.style)} readOnly={!isPreview} />}
        {node.type === "Textarea" && <textarea placeholder={node.props.placeholder} style={cleanStyle(node.style)} readOnly={!isPreview} />}
        {node.type === "Select" && <select style={cleanStyle(node.style)} disabled={!isPreview}><option>{node.props.placeholder ?? "Select..."}</option></select>}
        {node.type === "Video" && <video src={node.props.src} style={cleanStyle(node.style)} controls />}
      </div>
    );
  }

  // ── Container ─────────────────────────────────────────────────────────────
  if (isContainer) {
    const isRowLayout = node.style.flexDirection === "row" || node.style.display === "grid";
    return (
      <Tag
        ref={setCombinedRef as any}
        style={nodeStyle}
        onClick={handleClick}
        onMouseEnter={(e: React.MouseEvent) => { e.stopPropagation(); if (!isPreview) hoverNode(nodeId); }}
        onMouseLeave={() => hoverNode(null)}
      >
        {labelEl}

        {/* Children with insert zones between them */}
        {children.length > 0 && (
          <>
            <InsertZone parentId={nodeId} insertBefore={children[0].id} horizontal={isRowLayout} />
            {children.map((child, i) => (
              <React.Fragment key={child.id}>
                <CanvasNode nodeId={child.id} />
                <InsertZone
                  parentId={nodeId}
                  insertBefore={children[i + 1]?.id ?? null}
                  horizontal={isRowLayout}
                />
              </React.Fragment>
            ))}
          </>
        )}

        {/* Empty placeholder */}
        {children.length === 0 && !isPreview && (
          <div
            className={`flex items-center justify-center min-h-[60px] w-full border border-dashed text-xs font-mono transition-colors select-none ${
              isOver ? "border-purple-400 bg-purple-50 text-purple-500" : "border-zinc-300 text-zinc-400"
            }`}
          >
            {isOver ? "Drop here" : `Empty ${node.type}`}
          </div>
        )}
      </Tag>
    );
  }

  // ── Text / interactive ────────────────────────────────────────────────────
  const editableProps = isEditing && isTextNode
    ? { contentEditable: true as const, suppressContentEditableWarning: true }
    : {};
  const linkProps = node.type === "Link"
    ? {
        href: isPreview ? (node.props.href ?? "#") : undefined,
        target: node.props.target,
        onClick: isPreview && node.props.pageId
          ? (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); switchPage(node.props.pageId); }
          : (e: React.MouseEvent) => { if (!isPreview) e.preventDefault(); },
      }
    : {};

  // Determine display text (preview: wallet connect button shows state)
  let displayText = effectiveProps.text ?? "";
  if (isPreview && node.props.isConnectWallet) {
    displayText = isConnected
      ? `${walletAddress?.slice(0, 6)}…${walletAddress?.slice(-4)}`
      : (node.props.text || "Connect Wallet");
  }
  if (isPreview && node.contractAction && contractPending) {
    displayText = "Confirming…";
  }

  return (
    <Tag
      ref={(el: any) => { editRef.current = el; setCombinedRef(el); }}
      style={nodeStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onMouseEnter={(e: React.MouseEvent) => { e.stopPropagation(); if (!isPreview) hoverNode(nodeId); }}
      onMouseLeave={() => hoverNode(null)}
      {...editableProps}
      {...linkProps}
    >
      {labelEl}
      {!isEditing && displayText}
    </Tag>
  );
};

// ── Node toolbar ──────────────────────────────────────────────────────────────
// The ENTIRE toolbar bar acts as the drag handle (not just the grip icon).
// This gives a large easy-to-grab target.

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
    className="absolute top-0 left-0 z-[100] flex items-center gap-0 pointer-events-auto"
    style={{ transform: "translateY(-100%)" }}
    onClick={(e) => e.stopPropagation()}
    // ↑↑↑ The whole bar has the drag listeners — easy to grab ↑↑↑
    {...dragListeners}
    {...dragAttrs}
  >
    <div className="flex items-center gap-0.5 bg-zinc-900 border border-zinc-700 rounded-sm px-1.5 py-0.5 cursor-grab active:cursor-grabbing select-none">
      <GripVertical className="w-2.5 h-2.5 text-zinc-500 shrink-0" />
      <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400 mx-0.5">
        {node.type}
      </span>
    </div>

    <button
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); onParent(e); }}
      title="Select parent"
      className="h-5 px-1 bg-zinc-800 hover:bg-zinc-700 border-y border-r border-zinc-700 text-zinc-400 hover:text-zinc-200"
    >
      <ChevronUp className="w-2.5 h-2.5" />
    </button>
    <button
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
      title="Duplicate"
      className="h-5 px-1 bg-zinc-800 hover:bg-zinc-700 border-y border-r border-zinc-700 text-zinc-400 hover:text-zinc-200"
    >
      <Copy className="w-2.5 h-2.5" />
    </button>
    <button
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); onDelete(); }}
      title="Delete"
      className="h-5 px-1 bg-zinc-800 hover:bg-red-600 border-y border-r border-zinc-700 text-zinc-400 hover:text-white rounded-r-sm"
    >
      <Trash2 className="w-2.5 h-2.5" />
    </button>
  </div>
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function selectAllText(el: HTMLElement | null) {
  if (!el) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}
