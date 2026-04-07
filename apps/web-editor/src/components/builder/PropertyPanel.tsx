// components/builder/PropertyPanel.tsx
import { useState } from "react";
import { useBuilderStore } from "../../store/slices/useBuilderStore";
import type { StyleProps } from "../../types/builder";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

type PanelTab = "layout" | "spacing" | "size" | "typography" | "background" | "effects";

export const PropertyPanel = ({ saveStatus }: { saveStatus?: string }) => {
  const nodes = useBuilderStore((s) => s.nodes);
  const pages = useBuilderStore((s) => s.pages);
  const selectedId = useBuilderStore((s) => s.selectedId);
  const updateNodeStyle = useBuilderStore((s) => s.updateNodeStyle);
  const updateNodeProp = useBuilderStore((s) => s.updateNodeProp);

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

  const TABS: { id: PanelTab; label: string }[] = [
    { id: "layout", label: "Layout" },
    { id: "spacing", label: "Spacing" },
    { id: "size", label: "Size" },
    { id: "typography", label: "Type" },
    { id: "background", label: "BG" },
    { id: "effects", label: "FX" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          {node.type}
        </span>
        {saveStatus && saveStatus !== "idle" && (
          <span
            className={`text-[9px] font-mono uppercase ${
              saveStatus === "saving"
                ? "text-yellow-500"
                : saveStatus === "saved"
                  ? "text-emerald-500"
                  : "text-red-500"
            }`}
          >
            {saveStatus}
          </span>
        )}
      </div>

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
            className={`flex-1 py-2 text-[10px] font-medium uppercase tracking-wide whitespace-nowrap border-b-2 transition-colors ${
              tab === t.id
                ? "text-white border-purple-500"
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            }`}
          >
            {t.label}
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
