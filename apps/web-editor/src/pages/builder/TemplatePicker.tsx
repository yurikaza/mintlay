import { useState, useRef, useEffect } from "react";
import {
  WEBSITE_TEMPLATES,
  TEMPLATE_CATEGORIES,
  type WebsiteTemplate,
} from "./web3-templates";

interface TemplatePickerProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string, projectName: string) => void;
}

// ─── Mini layout-block mockup for the preview ─────────────────────────────────
function TemplateMockup({ template }: { template: WebsiteTemplate }) {
  const accent = template.thumbnail.accent;
  const secondary = template.thumbnail.secondary;

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden"
      style={{ height: 420, background: template.thumbnail.bg }}
    >
      {/* Simulated navbar */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-6"
        style={{ height: 36, background: "rgba(0,0,0,0.6)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="rounded" style={{ width: 48, height: 10, background: accent, opacity: 0.9 }} />
        <div className="flex gap-2">
          {[40, 36, 44, 60].map((w, i) => (
            <div key={i} className="rounded" style={{ width: w, height: 8, background: "rgba(255,255,255,0.15)" }} />
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="absolute left-0 right-0 flex flex-col items-center gap-2 pt-2" style={{ top: 48 }}>
        <div className="rounded" style={{ width: "55%", height: 14, background: "rgba(255,255,255,0.85)" }} />
        <div className="rounded" style={{ width: "40%", height: 14, background: "rgba(255,255,255,0.7)" }} />
        <div className="rounded" style={{ width: "65%", height: 8, background: "rgba(255,255,255,0.25)", marginTop: 4 }} />
        <div className="rounded" style={{ width: "55%", height: 8, background: "rgba(255,255,255,0.18)" }} />
        <div className="flex gap-2 mt-2">
          <div className="rounded-lg" style={{ width: 80, height: 22, background: accent }} />
          <div className="rounded-lg" style={{ width: 72, height: 22, background: "transparent", border: `1px solid ${accent}` }} />
        </div>
      </div>

      {/* Stats bar */}
      <div
        className="absolute left-0 right-0 flex"
        style={{ top: 188, height: 40, background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {[accent, secondary, accent, secondary].map((c, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-center gap-1" style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            <div className="rounded" style={{ width: 28, height: 8, background: c, opacity: 0.9 }} />
            <div className="rounded" style={{ width: 36, height: 5, background: "rgba(255,255,255,0.2)" }} />
          </div>
        ))}
      </div>

      {/* Content section */}
      <div className="absolute left-0 right-0 px-6" style={{ top: 244 }}>
        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", height: 80 }}>
              <div className="rounded mb-1" style={{ width: 16, height: 16, background: i === 0 ? accent : secondary, opacity: 0.8 }} />
              <div className="rounded mb-1" style={{ width: "70%", height: 7, background: "rgba(255,255,255,0.5)" }} />
              <div className="rounded mb-1" style={{ width: "90%", height: 5, background: "rgba(255,255,255,0.2)" }} />
              <div className="rounded" style={{ width: "80%", height: 5, background: "rgba(255,255,255,0.15)" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6"
        style={{ height: 32, background: "rgba(0,0,0,0.7)", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="rounded" style={{ width: 44, height: 8, background: accent, opacity: 0.7 }} />
        <div className="rounded" style={{ width: 80, height: 6, background: "rgba(255,255,255,0.12)" }} />
      </div>

      {/* Glow overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 40% at 50% 20%, ${accent}22 0%, transparent 70%)` }} />
    </div>
  );
}

// ─── Single template card ─────────────────────────────────────────────────────
function TemplateCard({
  template,
  isSelected,
  onSelect,
  onPreview,
}: {
  template: WebsiteTemplate;
  isSelected: boolean;
  onSelect: () => void;
  onPreview: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const accent = template.thumbnail.accent;

  const categoryColors: Record<string, string> = {
    NFT: "bg-purple-900/60 text-purple-300 border-purple-700/40",
    DeFi: "bg-cyan-900/60 text-cyan-300 border-cyan-700/40",
    DAO: "bg-emerald-900/60 text-emerald-300 border-emerald-700/40",
    Token: "bg-amber-900/60 text-amber-300 border-amber-700/40",
    Portfolio: "bg-violet-900/60 text-violet-300 border-violet-700/40",
    Blank: "bg-zinc-800/60 text-zinc-400 border-zinc-700/40",
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group border ${
        isSelected
          ? "border-purple-500 ring-2 ring-purple-500/50"
          : hovered
          ? "border-zinc-600"
          : "border-zinc-800"
      }`}
      style={{ backgroundColor: "#0d0d14" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      {/* Thumbnail area */}
      <div
        className="relative overflow-hidden"
        style={{ height: 160, background: template.thumbnail.bg }}
      >
        {/* Layout suggestion blocks */}
        <div className="absolute inset-0 flex flex-col gap-1 p-2 pt-1">
          {/* Nav bar block */}
          <div className="flex items-center justify-between px-2" style={{ height: 18, background: "rgba(0,0,0,0.5)", borderRadius: 4 }}>
            <div className="rounded" style={{ width: 28, height: 6, background: accent, opacity: 0.9 }} />
            <div className="flex gap-1">
              {[24, 20, 28].map((w, i) => (
                <div key={i} className="rounded" style={{ width: w, height: 5, background: "rgba(255,255,255,0.2)" }} />
              ))}
            </div>
          </div>
          {/* Hero block */}
          <div className="flex flex-col items-center justify-center flex-1 gap-1">
            <div className="rounded" style={{ width: "60%", height: 10, background: "rgba(255,255,255,0.7)" }} />
            <div className="rounded" style={{ width: "45%", height: 8, background: "rgba(255,255,255,0.5)" }} />
            <div className="rounded" style={{ width: "70%", height: 5, background: "rgba(255,255,255,0.2)", marginTop: 2 }} />
            <div className="flex gap-1 mt-1">
              <div className="rounded" style={{ width: 40, height: 12, background: accent, opacity: 0.85 }} />
              <div className="rounded" style={{ width: 36, height: 12, background: "rgba(255,255,255,0.1)", border: `1px solid ${accent}66` }} />
            </div>
          </div>
          {/* Stat row */}
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5" style={{ background: "rgba(0,0,0,0.3)", borderRadius: 3, padding: "3px 0" }}>
                <div className="rounded" style={{ width: "60%", height: 7, background: i % 2 === 0 ? accent : template.thumbnail.secondary, opacity: 0.8 }} />
                <div className="rounded" style={{ width: "70%", height: 4, background: "rgba(255,255,255,0.2)" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Emoji */}
        <div className="absolute top-2 left-3 text-3xl leading-none" style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0,0.8))" }}>
          {template.thumbnail.emoji}
        </div>

        {/* Category badge */}
        <div className={`absolute top-2 right-2 border text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[template.category] ?? categoryColors.Blank}`}>
          {template.category}
        </div>

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-200 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)" }}
        >
          <button
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-600 text-zinc-200 hover:bg-zinc-800 transition-colors"
            onClick={(e) => { e.stopPropagation(); onPreview(); }}
          >
            Preview
          </button>
          <button
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-colors"
            style={{ background: accent }}
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
          >
            Select
          </button>
        </div>

        {/* Selected tick */}
        {isSelected && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/40">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 70% 50% at 50% 10%, ${accent}1a 0%, transparent 70%)` }} />
      </div>

      {/* Card body */}
      <div className="p-3" style={{ backgroundColor: "#111118" }}>
        <div className="flex items-start justify-between mb-1">
          <p className="text-sm font-bold text-white leading-tight">{template.name}</p>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{template.description}</p>
      </div>
    </div>
  );
}

// ─── Preview modal ─────────────────────────────────────────────────────────────
function PreviewModal({
  template,
  onBack,
  onUse,
}: {
  template: WebsiteTemplate;
  onBack: () => void;
  onUse: () => void;
}) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col" style={{ background: "#07070a", borderRadius: "inherit" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-800/60 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <div className="w-px h-4 bg-zinc-700" />
        <div className="flex items-center gap-2">
          <span className="text-lg">{template.thumbnail.emoji}</span>
          <span className="text-sm font-bold text-white">{template.name}</span>
          <span className="text-xs text-zinc-500">{template.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-sm text-zinc-400 mb-6 max-w-xl">{template.description}</p>

        {/* Mockup */}
        <div className="max-w-3xl mx-auto mb-6">
          <TemplateMockup template={template} />
        </div>

        {/* Feature bullets */}
        <div className="max-w-3xl mx-auto grid grid-cols-2 gap-3">
          {template.pages[0]?.nodes
            .filter((n) => n.type === "Section" && n.parentRef === 0)
            .slice(0, 6)
            .map((_, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: template.thumbnail.accent }} />
                {[
                  "Sticky navigation bar",
                  "Hero section with CTAs",
                  "Live stats / metrics row",
                  "Feature / content grid",
                  "Roadmap / timeline",
                  "Footer with links",
                ][i] ?? `Section ${i + 1}`}
              </div>
            ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800/60 flex-shrink-0">
        <p className="text-xs text-zinc-600">
          {template.pages[0]?.nodes.length ?? 0} nodes · {template.pages.length} page
          {template.pages.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={onUse}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: `linear-gradient(135deg, ${template.thumbnail.secondary}, ${template.thumbnail.accent})` }}
        >
          Use This Template
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export function TemplatePicker({ open, onClose, onSelectTemplate }: TemplatePickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<WebsiteTemplate | null>(null);
  const [projectName, setProjectName] = useState("");
  const [nameError, setNameError] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Sync project name to picked template name
  useEffect(() => {
    if (pickedId) {
      const t = WEBSITE_TEMPLATES.find((t) => t.id === pickedId);
      if (t) setProjectName(t.name);
    }
  }, [pickedId]);

  // Focus name input when a template is picked
  useEffect(() => {
    if (pickedId) {
      setTimeout(() => nameInputRef.current?.focus(), 80);
    }
  }, [pickedId]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (previewTemplate) setPreviewTemplate(null);
        else onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, previewTemplate, onClose]);

  if (!open) return null;

  const filtered = WEBSITE_TEMPLATES.filter((t) => {
    const matchCat = selectedCategory === "All" || t.category === selectedCategory;
    const matchSearch =
      search.trim() === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const pickedTemplate = WEBSITE_TEMPLATES.find((t) => t.id === pickedId) ?? null;

  const handleUseTemplate = () => {
    if (!pickedId) return;
    const name = projectName.trim();
    if (!name) {
      setNameError(true);
      nameInputRef.current?.focus();
      return;
    }
    onSelectTemplate(pickedId, name);
    onClose();
  };

  const handleSelectFromPreview = (templateId: string) => {
    setPickedId(templateId);
    setPreviewTemplate(null);
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-6xl flex flex-col rounded-2xl overflow-hidden shadow-2xl"
        style={{ maxHeight: "90vh", backgroundColor: "#0a0a0f", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Preview overlay (absolute, inside panel) */}
        {previewTemplate && (
          <PreviewModal
            template={previewTemplate}
            onBack={() => setPreviewTemplate(null)}
            onUse={() => handleSelectFromPreview(previewTemplate.id)}
          />
        )}

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-zinc-800/60 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Start from a template</h2>
            <p className="text-sm text-zinc-500">Pick a Web3 template to jumpstart your project</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Filters + Search ── */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-zinc-800/60 flex-shrink-0 flex-wrap">
          {/* Category pills */}
          <div className="flex gap-1.5 flex-wrap">
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 ${
                  selectedCategory === cat
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                    : "text-zinc-400 hover:text-zinc-200 border border-zinc-700/60 hover:border-zinc-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="ml-auto relative">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg text-xs text-zinc-300 placeholder-zinc-600 outline-none focus:border-purple-500/50 transition-colors"
              style={{
                backgroundColor: "#111118",
                border: "1px solid rgba(255,255,255,0.08)",
                width: 180,
              }}
            />
          </div>
        </div>

        {/* ── Template grid ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ scrollbarWidth: "thin", scrollbarColor: "#27272a transparent" }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-sm font-medium">No templates match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={pickedId === template.id}
                  onSelect={() => setPickedId(template.id === pickedId ? null : template.id)}
                  onPreview={() => setPreviewTemplate(template)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          className="flex items-center gap-4 px-6 py-4 border-t border-zinc-800/60 flex-shrink-0"
          style={{ backgroundColor: "#0d0d14" }}
        >
          {/* Selected info + name input */}
          {pickedTemplate ? (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-xl flex-shrink-0">{pickedTemplate.thumbnail.emoji}</span>
              <div className="min-w-0 flex-shrink-0">
                <p className="text-xs text-zinc-500 leading-none mb-0.5">Selected</p>
                <p className="text-sm font-semibold text-white truncate">{pickedTemplate.name}</p>
              </div>
              <div className="w-px h-8 bg-zinc-700 flex-shrink-0" />
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <label className="text-xs text-zinc-500">Project name</label>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={projectName}
                  onChange={(e) => { setProjectName(e.target.value); setNameError(false); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleUseTemplate(); }}
                  placeholder="My project..."
                  className={`px-3 py-1.5 rounded-lg text-sm text-white placeholder-zinc-600 outline-none transition-colors ${
                    nameError ? "border-red-500" : "focus:border-purple-500/70"
                  }`}
                  style={{
                    backgroundColor: "#111118",
                    border: `1px solid ${nameError ? "#ef4444" : "rgba(255,255,255,0.08)"}`,
                    maxWidth: 260,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <p className="text-sm text-zinc-600">Select a template to get started</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!pickedId}
              onClick={handleUseTemplate}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 ${
                pickedId
                  ? "hover:opacity-90 active:scale-95 cursor-pointer"
                  : "opacity-30 cursor-not-allowed"
              }`}
              style={{
                background: pickedId
                  ? "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"
                  : "#3f3f46",
                boxShadow: pickedId ? "0 0 20px rgba(124,58,237,0.35)" : "none",
              }}
            >
              Use Template
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplatePicker;
