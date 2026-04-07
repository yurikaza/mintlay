// components/builder/PropertyPanel.tsx
import { useState } from "react";
import { Bookmark, Zap, Database, Plus, Trash2, Code2 } from "lucide-react";
import { useBuilderStore } from "../../store/slices/useBuilderStore";
import type { StyleProps, DataBinding, ContractAction, DataBindingSource } from "../../types/builder";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

type PanelTab = "layout" | "spacing" | "size" | "typography" | "background" | "effects" | "web3";

export const PropertyPanel = ({ saveStatus }: { saveStatus?: string }) => {
  const nodes              = useBuilderStore((s) => s.nodes);
  const pages              = useBuilderStore((s) => s.pages);
  const contracts          = useBuilderStore((s) => s.contracts);
  const selectedId         = useBuilderStore((s) => s.selectedId);
  const updateNodeStyle    = useBuilderStore((s) => s.updateNodeStyle);
  const updateNodeProp     = useBuilderStore((s) => s.updateNodeProp);
  const saveAsComponent    = useBuilderStore((s) => s.saveAsComponent);
  const setContractAction  = useBuilderStore((s) => s.setContractAction);
  const setDataBinding     = useBuilderStore((s) => s.setDataBinding);
  const removeDataBinding  = useBuilderStore((s) => s.removeDataBinding);
  const [savingComp, setSavingComp] = useState(false);
  const [compName, setCompName]     = useState("");

  const [tab, setTab] = useState<PanelTab>("layout");

  const node = nodes.find((n) => n.id === selectedId);

  if (!node) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-3 border-b border-zinc-800">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
            Style
          </p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 text-center">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
            <span className="text-zinc-600 text-lg">↖</span>
          </div>
          <p className="text-zinc-600 text-xs">
            Click any element on the canvas to edit its styles.
          </p>
        </div>
      </div>
    );
  }

  const s = node.style;
  const set = (style: Partial<StyleProps>) => updateNodeStyle(node.id, style);
  const setProp = (key: string, value: any) => updateNodeProp(node.id, key, value);

  const hasWeb3 = (node.contractAction || (node.dataBindings?.length ?? 0) > 0) || contracts.length > 0;

  const TABS: { id: PanelTab; label: string; badge?: boolean }[] = [
    { id: "layout", label: "Layout" },
    { id: "spacing", label: "Spacing" },
    { id: "size", label: "Size" },
    { id: "typography", label: "Type" },
    { id: "background", label: "BG" },
    { id: "effects", label: "FX" },
    { id: "web3", label: "Web3", badge: hasWeb3 },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          {node.type}
        </span>
        <div className="flex items-center gap-2">
          {saveStatus && saveStatus !== "idle" && (
            <span className={`text-[9px] font-mono uppercase ${saveStatus === "saving" ? "text-yellow-500" : saveStatus === "saved" ? "text-emerald-500" : "text-red-500"}`}>
              {saveStatus}
            </span>
          )}
          {/* Save as component button */}
          <button
            onClick={() => setSavingComp((v) => !v)}
            title="Save as Component"
            className={`p-1 rounded transition-colors ${savingComp ? "text-purple-400 bg-purple-600/20" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Save as Component inline form */}
      {savingComp && (
        <div className="px-3 py-2 border-b border-zinc-800 flex gap-2 shrink-0">
          <input
            autoFocus
            value={compName}
            onChange={(e) => setCompName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && compName.trim()) {
                saveAsComponent(node.id, compName.trim());
                setCompName(""); setSavingComp(false);
              }
              if (e.key === "Escape") { setCompName(""); setSavingComp(false); }
            }}
            placeholder="Component name..."
            className="flex-1 h-7 px-2 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={() => {
              if (compName.trim()) {
                saveAsComponent(node.id, compName.trim());
                setCompName(""); setSavingComp(false);
              }
            }}
            className="px-2 h-7 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded"
          >
            Save
          </button>
        </div>
      )}

      {/* Content prop editor (text nodes) */}
      {node.props.text !== undefined && (
        <div className="px-3 py-2 border-b border-zinc-800 shrink-0">
          <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">
            Content
          </label>
          <textarea
            value={node.props.text ?? ""}
            onChange={(e) => setProp("text", e.target.value)}
            rows={2}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-200 resize-none focus:outline-none focus:border-purple-500"
          />
        </div>
      )}

      {/* Link href */}
      {node.type === "Link" && (
        <div className="px-3 py-2 border-b border-zinc-800 shrink-0">
          <SI
            label="URL"
            value={node.props.href ?? ""}
            onChange={(v) => setProp("href", v)}
            placeholder="https://..."
          />
        </div>
      )}

      {/* Image src/alt */}
      {node.type === "Image" && (
        <div className="px-3 py-2 border-b border-zinc-800 space-y-2 shrink-0">
          <SI label="Src" value={node.props.src ?? ""} onChange={(v) => setProp("src", v)} placeholder="https://..." />
          <SI label="Alt" value={node.props.alt ?? ""} onChange={(v) => setProp("alt", v)} placeholder="Description" />
        </div>
      )}

      {/* Link / Button settings */}
      {(node.type === "Link" || node.type === "Button") && (
        <div className="px-3 py-2 border-b border-zinc-800 space-y-2 shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
            Link Settings
          </p>

          {/* Link type */}
          <div className="flex gap-1">
            {(["none", "url", "page"] as const).map((lt) => (
              <button
                key={lt}
                onClick={() => setProp("linkType", lt)}
                className={`flex-1 h-6 rounded text-[10px] font-mono transition-colors ${
                  (node.props.linkType ?? "none") === lt
                    ? "bg-purple-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {lt === "none" ? "None" : lt === "url" ? "URL" : "Page"}
              </button>
            ))}
          </div>

          {node.props.linkType === "url" && (
            <>
              <SI label="URL" value={node.props.href ?? ""} onChange={(v) => setProp("href", v)} placeholder="https://..." />
              <div className="flex gap-1">
                {(["_self", "_blank"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setProp("target", t)}
                    className={`flex-1 h-6 rounded text-[10px] font-mono transition-colors ${
                      (node.props.target ?? "_self") === t
                        ? "bg-purple-600 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {t === "_self" ? "Same tab" : "New tab"}
                  </button>
                ))}
              </div>
            </>
          )}

          {node.props.linkType === "page" && (
            <select
              value={node.props.pageId ?? ""}
              onChange={(e) => setProp("pageId", e.target.value)}
              className="w-full h-7 px-2 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            >
              <option value="">— Select a page —</option>
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.slug})
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 shrink-0 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative flex-1 py-2 text-[10px] font-medium uppercase tracking-wide whitespace-nowrap border-b-2 transition-colors ${
              tab === t.id
                ? "text-white border-purple-500"
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            }`}
          >
            {t.label}
            {t.badge && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-violet-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {tab === "layout" && (
          <>
            <Section label="Display">
              <BtnGroup
                options={[
                  { label: "Block", value: "block" },
                  { label: "Flex", value: "flex" },
                  { label: "Grid", value: "grid" },
                  { label: "None", value: "none" },
                ]}
                value={s.display ?? "block"}
                onChange={(v) => set({ display: v })}
              />
            </Section>

            {s.display === "flex" && (
              <>
                <Section label="Direction">
                  <BtnGroup
                    options={[
                      { label: "→ Row", value: "row" },
                      { label: "↓ Col", value: "column" },
                      { label: "← Rev", value: "row-reverse" },
                    ]}
                    value={s.flexDirection ?? "row"}
                    onChange={(v) => set({ flexDirection: v })}
                  />
                </Section>

                <Section label="Wrap">
                  <BtnGroup
                    options={[
                      { label: "No wrap", value: "nowrap" },
                      { label: "Wrap", value: "wrap" },
                    ]}
                    value={s.flexWrap ?? "nowrap"}
                    onChange={(v) => set({ flexWrap: v })}
                  />
                </Section>

                <Section label="Justify">
                  <BtnGroup
                    options={[
                      { label: "Start", value: "flex-start" },
                      { label: "Center", value: "center" },
                      { label: "End", value: "flex-end" },
                      { label: "Space-B", value: "space-between" },
                      { label: "Space-A", value: "space-around" },
                    ]}
                    value={s.justifyContent ?? "flex-start"}
                    onChange={(v) => set({ justifyContent: v })}
                  />
                </Section>

                <Section label="Align">
                  <BtnGroup
                    options={[
                      { label: "Start", value: "flex-start" },
                      { label: "Center", value: "center" },
                      { label: "End", value: "flex-end" },
                      { label: "Stretch", value: "stretch" },
                    ]}
                    value={s.alignItems ?? "stretch"}
                    onChange={(v) => set({ alignItems: v })}
                  />
                </Section>

                <Section label="Gap">
                  <SI label="Gap" value={s.gap ?? ""} onChange={(v) => set({ gap: v })} placeholder="16px" />
                </Section>
              </>
            )}

            {s.display === "grid" && (
              <>
                <Section label="Grid Columns">
                  <SI label="Template" value={s.gridTemplateColumns ?? ""} onChange={(v) => set({ gridTemplateColumns: v })} placeholder="repeat(3, 1fr)" />
                </Section>
                <Section label="Grid Rows">
                  <SI label="Template" value={s.gridTemplateRows ?? ""} onChange={(v) => set({ gridTemplateRows: v })} placeholder="auto" />
                </Section>
                <Section label="Gap">
                  <div className="grid grid-cols-2 gap-1.5">
                    <SI label="Col gap" value={s.columnGap ?? ""} onChange={(v) => set({ columnGap: v })} placeholder="16px" />
                    <SI label="Row gap" value={s.rowGap ?? ""} onChange={(v) => set({ rowGap: v })} placeholder="16px" />
                  </div>
                </Section>
              </>
            )}

            <Section label="Overflow">
              <BtnGroup
                options={[
                  { label: "Visible", value: "visible" },
                  { label: "Hidden", value: "hidden" },
                  { label: "Auto", value: "auto" },
                  { label: "Scroll", value: "scroll" },
                ]}
                value={s.overflow ?? "visible"}
                onChange={(v) => set({ overflow: v })}
              />
            </Section>

            <Section label="Position">
              <BtnGroup
                options={[
                  { label: "Static", value: "static" },
                  { label: "Relative", value: "relative" },
                  { label: "Absolute", value: "absolute" },
                  { label: "Fixed", value: "fixed" },
                  { label: "Sticky", value: "sticky" },
                ]}
                value={s.position ?? "static"}
                onChange={(v) => set({ position: v })}
              />
              {(s.position === "absolute" || s.position === "fixed" || s.position === "sticky") && (
                <div className="grid grid-cols-2 gap-1.5 mt-2">
                  <SI label="Top" value={s.top ?? ""} onChange={(v) => set({ top: v })} placeholder="0px" />
                  <SI label="Right" value={s.right ?? ""} onChange={(v) => set({ right: v })} placeholder="auto" />
                  <SI label="Bottom" value={s.bottom ?? ""} onChange={(v) => set({ bottom: v })} placeholder="auto" />
                  <SI label="Left" value={s.left ?? ""} onChange={(v) => set({ left: v })} placeholder="0px" />
                  <SI label="Z-Index" value={s.zIndex ?? ""} onChange={(v) => set({ zIndex: v })} placeholder="1" />
                </div>
              )}
            </Section>
          </>
        )}

        {tab === "spacing" && (
          <>
            <Section label="Padding">
              <SpacingBox
                top={s.paddingTop}
                right={s.paddingRight}
                bottom={s.paddingBottom}
                left={s.paddingLeft}
                onChange={(side, v) => {
                  const key = `padding${side.charAt(0).toUpperCase() + side.slice(1)}` as keyof StyleProps;
                  set({ [key]: v });
                }}
              />
            </Section>
            <Section label="Margin">
              <SpacingBox
                top={s.marginTop}
                right={s.marginRight}
                bottom={s.marginBottom}
                left={s.marginLeft}
                onChange={(side, v) => {
                  const key = `margin${side.charAt(0).toUpperCase() + side.slice(1)}` as keyof StyleProps;
                  set({ [key]: v });
                }}
              />
            </Section>
          </>
        )}

        {tab === "size" && (
          <>
            <Section label="Size">
              <div className="grid grid-cols-2 gap-1.5">
                <SI label="W" value={s.width ?? ""} onChange={(v) => set({ width: v })} placeholder="100%" />
                <SI label="H" value={s.height ?? ""} onChange={(v) => set({ height: v })} placeholder="auto" />
                <SI label="Max W" value={s.maxWidth ?? ""} onChange={(v) => set({ maxWidth: v })} placeholder="none" />
                <SI label="Min W" value={s.minWidth ?? ""} onChange={(v) => set({ minWidth: v })} placeholder="none" />
                <SI label="Max H" value={s.maxHeight ?? ""} onChange={(v) => set({ maxHeight: v })} placeholder="none" />
                <SI label="Min H" value={s.minHeight ?? ""} onChange={(v) => set({ minHeight: v })} placeholder="none" />
              </div>
            </Section>
            <Section label="Flex Child">
              <SI label="Flex" value={s.flex ?? ""} onChange={(v) => set({ flex: v })} placeholder="1" />
              <div className="mt-1.5">
                <BtnGroup
                  options={[
                    { label: "auto", value: "auto" },
                    { label: "start", value: "flex-start" },
                    { label: "center", value: "center" },
                    { label: "end", value: "flex-end" },
                    { label: "stretch", value: "stretch" },
                  ]}
                  value={s.alignSelf ?? "auto"}
                  onChange={(v) => set({ alignSelf: v })}
                />
              </div>
            </Section>
          </>
        )}

        {tab === "typography" && (
          <>
            <Section label="Font">
              <SI label="Family" value={s.fontFamily ?? ""} onChange={(v) => set({ fontFamily: v })} placeholder="Inter, sans-serif" />
              <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                <SI label="Size" value={s.fontSize ?? ""} onChange={(v) => set({ fontSize: v })} placeholder="16px" />
                <SI label="Weight" value={s.fontWeight ?? ""} onChange={(v) => set({ fontWeight: v })} placeholder="400" />
                <SI label="Line H" value={s.lineHeight ?? ""} onChange={(v) => set({ lineHeight: v })} placeholder="1.6" />
                <SI label="Spacing" value={s.letterSpacing ?? ""} onChange={(v) => set({ letterSpacing: v })} placeholder="0" />
              </div>
            </Section>

            <Section label="Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={s.color ?? "#000000"}
                  onChange={(e) => set({ color: e.target.value })}
                  className="w-8 h-7 rounded border border-zinc-700 bg-zinc-900 cursor-pointer p-0.5"
                />
                <input
                  value={s.color ?? ""}
                  onChange={(e) => set({ color: e.target.value })}
                  placeholder="#000000"
                  className="flex-1 h-7 px-2 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </Section>

            <Section label="Align">
              <div className="flex gap-1">
                {[
                  { value: "left", Icon: AlignLeft },
                  { value: "center", Icon: AlignCenter },
                  { value: "right", Icon: AlignRight },
                  { value: "justify", Icon: AlignJustify },
                ].map(({ value, Icon }) => (
                  <button
                    key={value}
                    onClick={() => set({ textAlign: value })}
                    className={`flex-1 flex items-center justify-center h-7 rounded text-xs transition-colors ${
                      s.textAlign === value
                        ? "bg-purple-600 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </Section>

            <Section label="Transform">
              <BtnGroup
                options={[
                  { label: "Aa", value: "none" },
                  { label: "AA", value: "uppercase" },
                  { label: "aa", value: "lowercase" },
                  { label: "Aa", value: "capitalize" },
                ]}
                value={s.textTransform ?? "none"}
                onChange={(v) => set({ textTransform: v })}
              />
            </Section>

            <Section label="Decoration">
              <BtnGroup
                options={[
                  { label: "None", value: "none" },
                  { label: "Under", value: "underline" },
                  { label: "Strike", value: "line-through" },
                ]}
                value={s.textDecoration ?? "none"}
                onChange={(v) => set({ textDecoration: v })}
              />
            </Section>
          </>
        )}

        {tab === "background" && (
          <>
            <Section label="Background Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={s.backgroundColor ?? "#ffffff"}
                  onChange={(e) => set({ backgroundColor: e.target.value })}
                  className="w-8 h-7 rounded border border-zinc-700 bg-zinc-900 cursor-pointer p-0.5"
                />
                <input
                  value={s.backgroundColor ?? ""}
                  onChange={(e) => set({ backgroundColor: e.target.value })}
                  placeholder="transparent"
                  className="flex-1 h-7 px-2 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={() => set({ backgroundColor: "transparent" })}
                  className="px-2 h-7 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-400 hover:text-zinc-200"
                >
                  Clear
                </button>
              </div>
            </Section>

            <Section label="Background Image">
              <SI label="URL" value={s.backgroundImage ?? ""} onChange={(v) => set({ backgroundImage: v ? `url(${v})` : "" })} placeholder="https://..." />
              <div className="mt-1.5">
                <BtnGroup
                  options={[
                    { label: "Cover", value: "cover" },
                    { label: "Contain", value: "contain" },
                    { label: "Auto", value: "auto" },
                  ]}
                  value={s.backgroundSize ?? "cover"}
                  onChange={(v) => set({ backgroundSize: v })}
                />
              </div>
              <div className="mt-1.5">
                <BtnGroup
                  options={[
                    { label: "No rep", value: "no-repeat" },
                    { label: "Repeat", value: "repeat" },
                    { label: "Rep-X", value: "repeat-x" },
                    { label: "Rep-Y", value: "repeat-y" },
                  ]}
                  value={s.backgroundRepeat ?? "no-repeat"}
                  onChange={(v) => set({ backgroundRepeat: v })}
                />
              </div>
            </Section>
          </>
        )}

        {tab === "web3" && (
          <Web3Tab
            node={node}
            contracts={contracts}
            onSetContractAction={(action) => setContractAction(node.id, action)}
            onSetDataBinding={(b) => setDataBinding(node.id, b)}
            onRemoveDataBinding={(propKey) => removeDataBinding(node.id, propKey)}
          />
        )}

        {tab === "effects" && (
          <>
            <Section label="Opacity">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={parseFloat(s.opacity ?? "1")}
                  onChange={(e) => set({ opacity: e.target.value })}
                  className="flex-1 accent-purple-500"
                />
                <input
                  value={s.opacity ?? "1"}
                  onChange={(e) => set({ opacity: e.target.value })}
                  className="w-14 h-7 px-2 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-200 focus:outline-none focus:border-purple-500 text-center"
                />
              </div>
            </Section>

            <Section label="Box Shadow">
              <textarea
                value={s.boxShadow ?? ""}
                onChange={(e) => set({ boxShadow: e.target.value })}
                placeholder="0 4px 16px rgba(0,0,0,0.1)"
                rows={2}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-200 resize-none focus:outline-none focus:border-purple-500"
              />
            </Section>

            <Section label="Border">
              <div className="grid grid-cols-2 gap-1.5">
                <SI label="T" value={s.borderTopWidth ?? ""} onChange={(v) => set({ borderTopWidth: v })} placeholder="0px" />
                <SI label="R" value={s.borderRightWidth ?? ""} onChange={(v) => set({ borderRightWidth: v })} placeholder="0px" />
                <SI label="B" value={s.borderBottomWidth ?? ""} onChange={(v) => set({ borderBottomWidth: v })} placeholder="0px" />
                <SI label="L" value={s.borderLeftWidth ?? ""} onChange={(v) => set({ borderLeftWidth: v })} placeholder="0px" />
              </div>
              <div className="mt-1.5">
                <BtnGroup
                  options={[
                    { label: "Solid", value: "solid" },
                    { label: "Dashed", value: "dashed" },
                    { label: "Dotted", value: "dotted" },
                    { label: "None", value: "none" },
                  ]}
                  value={s.borderStyle ?? "solid"}
                  onChange={(v) => set({ borderStyle: v })}
                />
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <input
                  type="color"
                  value={s.borderColor ?? "#000000"}
                  onChange={(e) => set({ borderColor: e.target.value })}
                  className="w-8 h-7 rounded border border-zinc-700 bg-zinc-900 cursor-pointer p-0.5"
                />
                <input
                  value={s.borderColor ?? ""}
                  onChange={(e) => set({ borderColor: e.target.value })}
                  placeholder="#000000"
                  className="flex-1 h-7 px-2 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </Section>

            <Section label="Border Radius">
              <div className="grid grid-cols-2 gap-1.5">
                <SI label="TL" value={s.borderTopLeftRadius ?? ""} onChange={(v) => set({ borderTopLeftRadius: v })} placeholder="0px" />
                <SI label="TR" value={s.borderTopRightRadius ?? ""} onChange={(v) => set({ borderTopRightRadius: v })} placeholder="0px" />
                <SI label="BR" value={s.borderBottomRightRadius ?? ""} onChange={(v) => set({ borderBottomRightRadius: v })} placeholder="0px" />
                <SI label="BL" value={s.borderBottomLeftRadius ?? ""} onChange={(v) => set({ borderBottomLeftRadius: v })} placeholder="0px" />
              </div>
              <div className="mt-1.5">
                <SI label="All" value={s.borderRadius ?? ""} onChange={(v) => set({ borderRadius: v })} placeholder="0px" />
              </div>
            </Section>

            <Section label="Filter">
              <SI label="Filter" value={s.filter ?? ""} onChange={(v) => set({ filter: v })} placeholder="blur(4px)" />
            </Section>

            <Section label="Cursor">
              <BtnGroup
                options={[
                  { label: "Default", value: "default" },
                  { label: "Pointer", value: "pointer" },
                  { label: "Text", value: "text" },
                  { label: "Move", value: "move" },
                ]}
                value={s.cursor ?? "default"}
                onChange={(v) => set({ cursor: v })}
              />
            </Section>
          </>
        )}
      </div>
    </div>
  );
};

// ── Web3 tab ──────────────────────────────────────────────────────────────────

const BIND_PROP_OPTIONS = ["text", "src", "href", "alt", "placeholder", "value"];

const Web3Tab = ({
  node,
  contracts,
  onSetContractAction,
  onSetDataBinding,
  onRemoveDataBinding,
}: {
  node: { id: string; type: string; contractAction?: ContractAction; dataBindings?: DataBinding[] };
  contracts: Array<{ id: string; name: string; abi: Array<{ name: string; type: string; stateMutability?: string; inputs?: Array<{ name: string; type: string }> }> }>;
  onSetContractAction: (a: ContractAction | null) => void;
  onSetDataBinding: (b: DataBinding) => void;
  onRemoveDataBinding: (propKey: string) => void;
}) => {
  const [showBindForm, setShowBindForm]     = useState(false);
  const [bindProp, setBindProp]             = useState("text");
  const [bindKind, setBindKind]             = useState<DataBindingSource["kind"]>("contractRead");
  const [bindContractId, setBindContractId] = useState("");
  const [bindFnName, setBindFnName]         = useState("");
  const [bindParam, setBindParam]           = useState("id");

  const [showActionForm, setShowActionForm]   = useState(false);
  const [actionContractId, setActionContractId] = useState("");
  const [actionFnName, setActionFnName]         = useState("");
  const [actionArgs, setActionArgs]             = useState("");
  const [actionValue, setActionValue]           = useState("");

  const bindings    = node.dataBindings ?? [];
  const action      = node.contractAction;

  const readFns = (contractId: string) => {
    const c = contracts.find((c) => c.id === contractId);
    return (c?.abi ?? []).filter(
      (f) => f.type === "function" && (f.stateMutability === "view" || f.stateMutability === "pure"),
    );
  };

  const writeFns = (contractId: string) => {
    const c = contracts.find((c) => c.id === contractId);
    return (c?.abi ?? []).filter(
      (f) => f.type === "function" && (f.stateMutability === "nonpayable" || f.stateMutability === "payable"),
    );
  };

  const addBinding = () => {
    let source: DataBindingSource;
    if (bindKind === "contractRead") {
      if (!bindContractId || !bindFnName) return;
      source = { kind: "contractRead", contractId: bindContractId, functionName: bindFnName };
    } else if (bindKind === "dynamicParam") {
      source = { kind: "dynamicParam", paramName: bindParam };
    } else {
      source = { kind: "walletAddress" };
    }
    onSetDataBinding({ propKey: bindProp, source });
    setShowBindForm(false);
    setBindContractId("");
    setBindFnName("");
  };

  const addAction = () => {
    if (!actionContractId || !actionFnName) return;
    const args = actionArgs.trim() ? actionArgs.split(",").map((a) => a.trim()) : [];
    onSetContractAction({
      contractId: actionContractId,
      functionName: actionFnName,
      args: args.length ? args : undefined,
      value: actionValue.trim() || undefined,
    });
    setShowActionForm(false);
    setActionContractId("");
    setActionFnName("");
    setActionArgs("");
    setActionValue("");
  };

  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
        <Code2 className="w-8 h-8 text-zinc-700" />
        <p className="text-zinc-600 text-[11px] leading-relaxed">
          Add a smart contract in the <strong className="text-zinc-400">Web3</strong> sidebar tab to bind this element to on-chain data or trigger contract calls.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Data Bindings ── */}
      <Section label="Data Bindings">
        <div className="space-y-1.5">
          {bindings.map((b) => {
            const label =
              b.source.kind === "contractRead"
                ? `${contracts.find((c) => c.id === b.source.contractId)?.name ?? "?"}.${(b.source as any).functionName}()`
                : b.source.kind === "dynamicParam"
                ? `:${(b.source as any).paramName}`
                : "wallet";

            return (
              <div key={b.propKey} className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-zinc-900 border border-zinc-800">
                <Database className="w-3 h-3 text-violet-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-zinc-400 text-[10px] font-mono">{b.propKey}</span>
                  <span className="text-zinc-600 text-[10px]"> ← </span>
                  <span className="text-violet-300 text-[10px] font-mono truncate">{label}</span>
                </div>
                <button onClick={() => onRemoveDataBinding(b.propKey)} className="text-zinc-600 hover:text-red-400 shrink-0">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {showBindForm ? (
          <div className="mt-2 p-2 rounded bg-zinc-900 border border-zinc-800 space-y-1.5">
            <select value={bindProp} onChange={(e) => setBindProp(e.target.value)} className="w-full h-6 px-2 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-200 outline-none">
              {BIND_PROP_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className="flex gap-1">
              {(["contractRead", "dynamicParam", "walletAddress"] as const).map((k) => (
                <button key={k} onClick={() => setBindKind(k)} className={`flex-1 h-5 rounded text-[9px] transition-colors ${bindKind === k ? "bg-violet-600 text-white" : "bg-zinc-800 text-zinc-500"}`}>
                  {k === "contractRead" ? "Contract" : k === "dynamicParam" ? "Param" : "Wallet"}
                </button>
              ))}
            </div>
            {bindKind === "contractRead" && (
              <>
                <select value={bindContractId} onChange={(e) => { setBindContractId(e.target.value); setBindFnName(""); }} className="w-full h-6 px-2 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-200 outline-none">
                  <option value="">— Select contract —</option>
                  {contracts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {bindContractId && (
                  <select value={bindFnName} onChange={(e) => setBindFnName(e.target.value)} className="w-full h-6 px-2 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-200 outline-none">
                    <option value="">— Select function —</option>
                    {readFns(bindContractId).map((f) => <option key={f.name} value={f.name}>{f.name}()</option>)}
                  </select>
                )}
              </>
            )}
            {bindKind === "dynamicParam" && (
              <input value={bindParam} onChange={(e) => setBindParam(e.target.value)} placeholder="param name e.g. id" className="w-full h-6 px-2 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-200 outline-none font-mono" />
            )}
            <div className="flex gap-1">
              <button onClick={addBinding} className="flex-1 h-6 bg-violet-600 hover:bg-violet-500 text-white text-[10px] rounded">Bind</button>
              <button onClick={() => setShowBindForm(false)} className="px-2 h-6 bg-zinc-700 text-zinc-300 text-[10px] rounded">✕</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowBindForm(true)} className="mt-1.5 w-full flex items-center justify-center gap-1 h-6 rounded border border-dashed border-zinc-700 text-zinc-600 hover:text-zinc-400 hover:border-zinc-600 text-[10px] transition-colors">
            <Plus className="w-3 h-3" /> Add Binding
          </button>
        )}
      </Section>

      {/* ── Contract Action (buttons only) ── */}
      {(node.type === "Button" || node.type === "Link") && (
        <Section label="Contract Action">
          {action ? (
            <div className="flex items-start gap-1.5 px-2 py-1.5 rounded bg-zinc-900 border border-amber-900/40">
              <Zap className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-amber-300 text-[10px] font-mono">
                  {contracts.find((c) => c.id === action.contractId)?.name ?? "?"}.{action.functionName}()
                </p>
                {action.args?.length ? (
                  <p className="text-zinc-600 text-[9px] font-mono truncate">args: {action.args.join(", ")}</p>
                ) : null}
                {action.value ? (
                  <p className="text-zinc-600 text-[9px] font-mono">value: {action.value}</p>
                ) : null}
              </div>
              <button onClick={() => onSetContractAction(null)} className="text-zinc-600 hover:text-red-400 shrink-0">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ) : showActionForm ? (
            <div className="p-2 rounded bg-zinc-900 border border-zinc-800 space-y-1.5">
              <select value={actionContractId} onChange={(e) => { setActionContractId(e.target.value); setActionFnName(""); }} className="w-full h-6 px-2 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-200 outline-none">
                <option value="">— Select contract —</option>
                {contracts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {actionContractId && (
                <select value={actionFnName} onChange={(e) => setActionFnName(e.target.value)} className="w-full h-6 px-2 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-200 outline-none">
                  <option value="">— Select function —</option>
                  {writeFns(actionContractId).map((f) => <option key={f.name} value={f.name}>{f.name}()</option>)}
                </select>
              )}
              <input value={actionArgs} onChange={(e) => setActionArgs(e.target.value)} placeholder="Args (comma-separated)" className="w-full h-6 px-2 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-200 outline-none" />
              <input value={actionValue} onChange={(e) => setActionValue(e.target.value)} placeholder="ETH value in wei (optional)" className="w-full h-6 px-2 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-200 outline-none" />
              <div className="flex gap-1">
                <button onClick={addAction} className="flex-1 h-6 bg-amber-600 hover:bg-amber-500 text-white text-[10px] rounded">Set Action</button>
                <button onClick={() => setShowActionForm(false)} className="px-2 h-6 bg-zinc-700 text-zinc-300 text-[10px] rounded">✕</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowActionForm(true)} className="w-full flex items-center justify-center gap-1 h-6 rounded border border-dashed border-zinc-700 text-zinc-600 hover:text-amber-400 hover:border-amber-800 text-[10px] transition-colors">
              <Zap className="w-3 h-3" /> Add Contract Action
            </button>
          )}
        </Section>
      )}
    </div>
  );
};

// ── Small UI components ───────────────────────────────────────────────────────

const Section = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
      {label}
    </p>
    {children}
  </div>
);

/** Style Input */
const SI = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-[10px] text-zinc-500 w-10 shrink-0 truncate">
      {label}
    </span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex-1 h-6 px-2 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
    />
  </div>
);

const BtnGroup = ({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-wrap gap-1">
    {options.map((o) => (
      <button
        key={o.value}
        onClick={() => onChange(o.value)}
        className={`px-2 h-6 rounded text-[10px] font-mono transition-colors ${
          value === o.value
            ? "bg-purple-600 text-white"
            : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

/** Visual margin/padding box with 4 inputs */
const SpacingBox = ({
  top,
  right,
  bottom,
  left,
  onChange,
}: {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  onChange: (side: "top" | "right" | "bottom" | "left", v: string) => void;
}) => (
  <div className="space-y-1.5">
    <div className="flex justify-center">
      <SpacingInput value={top} onChange={(v) => onChange("top", v)} placeholder="0" />
    </div>
    <div className="flex items-center gap-1.5">
      <SpacingInput value={left} onChange={(v) => onChange("left", v)} placeholder="0" />
      <div className="flex-1 h-8 border border-dashed border-zinc-700 rounded flex items-center justify-center">
        <span className="text-[9px] text-zinc-700 font-mono">BOX</span>
      </div>
      <SpacingInput value={right} onChange={(v) => onChange("right", v)} placeholder="0" />
    </div>
    <div className="flex justify-center">
      <SpacingInput value={bottom} onChange={(v) => onChange("bottom", v)} placeholder="0" />
    </div>
  </div>
);

const SpacingInput = ({
  value,
  onChange,
  placeholder,
}: {
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <input
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-14 h-6 px-1 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-200 text-center focus:outline-none focus:border-purple-500"
  />
);
